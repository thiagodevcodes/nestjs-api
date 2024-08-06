import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerResponse } from './interfaces/ResponseMessages';
import { Person } from 'src/person/person.entity';
import { PersonService } from 'src/person/person.service';
import { updateObject } from "src/utils/utils"


@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,

        @InjectRepository(Person)
        private personService: PersonService,
    ) {}

    findAll(): Promise<Customer[]> {
        return this.customerRepository.find();
    }

    async findById(id: number): Promise<Customer> {
        const customer: Customer = await this.customerRepository.findOneBy({ id })
        if(!customer) throw new NotFoundException(`Cliente com o id: ${id} não encontrado.`)
    
        return customer;
    }

    async insert(customer: Customer): Promise<CustomerResponse> {
        const savedCustomer = await this.customerRepository.save(customer);
        if (!savedCustomer) throw new InternalServerErrorException('Erro ao salvar o cliente.');

        return { 
            message: "Cliente criado com sucesso",
            customer: savedCustomer,
            statusCode: HttpStatus.CREATED
        };
    }

    async update(customer: Customer, id: number): Promise<CustomerResponse> {
        const existingCustomer = await this.customerRepository.findOne({ where: { id }, relations: ['person'] });
        if (!existingCustomer) throw new NotFoundException(`Cliente com Id: ${id} não encontrado.`);
    
        if (customer.person) {  
            const existingPerson = existingCustomer.person;   

            if (!existingPerson) throw new NotFoundException(`Pessoa relacionada ao cliente com Id: ${id} não encontrada.`);
            const existCpf = await this.personService.existCpf(customer.person.cpf);
            const existEmail = await this.personService.existEmail(customer.person.email);

            if(existCpf && customer.person.cpf) throw new ConflictException("Já existe o CPF")
            if(existEmail && customer.person.email) throw new ConflictException("Já existe o Email")
                   
            await this.personService.update({ ...existingPerson, ...customer.person }, existingPerson.id);
        }
    
        const { person, ...customerData } = customer;
        await this.customerRepository.update(id, { ...existingCustomer, ...customerData });
    
        const customerResult = await this.customerRepository.findOne({ where: { id }, relations: ['person']});
    
        return { 
            message: "Cliente atualizado com sucesso",
            customer: customerResult,
            statusCode: HttpStatus.OK
        };
    }

    async delete(id: number): Promise<CustomerResponse> {
        const deleteCustomer = await this.customerRepository.delete(id)

        if(deleteCustomer.affected == 0) throw new NotFoundException(`Cliente com id: ${id} não existe.`)
        
        return {
            message: "Cliente deletado com sucesso.",
            statusCode: HttpStatus.OK  
        } 
    }
}
