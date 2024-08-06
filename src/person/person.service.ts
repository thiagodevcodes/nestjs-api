import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Person } from './person.entity';
import { PersonResponse } from './interfaces/ResponseMessages';


@Injectable()
export class PersonService {
    constructor(
        @InjectRepository(Person)
        private personRepository: Repository<Person>,
    ) {}

    findAll(): Promise<Person[]> {
        return this.personRepository.find();
    }

    async findById(id: number): Promise<Person> {
        const person: Person = await this.personRepository.findOneBy({ id })
        if(!person) throw new NotFoundException(`Pessoa com o id: ${id} não encontrado.`)
    
        return person;
    }

    async insert(person: Person): Promise<PersonResponse> {
        const existingPersonCpf = await this.personRepository.findOne({ where: { cpf: person.cpf } });   
        if (existingPersonCpf) throw new ConflictException(`Usuário com o CPF: ${person.cpf} já existe`);
        const existingPersonEmail = await this.personRepository.findOne({ where: { email: person.email } }); 
        if (existingPersonEmail) throw new ConflictException(`Usuário com o Email: ${person.email} já existe`);
        const existingPersonPhone = await this.personRepository.findOne({ where: { phone: person.phone } }); 
        if (existingPersonPhone) throw new ConflictException(`Usuário com o Telefone: ${person.phone} já existe`);
       
        const savedPerson = await this.personRepository.save(person);
        if (!savedPerson) throw new InternalServerErrorException('Erro ao salvar a pessoa.');

        return { 
            message: "Pessoa criada com sucesso",
            person: savedPerson,
            statusCode: HttpStatus.CREATED
        };
    }

    async update(person: Person, id: number): Promise<PersonResponse> {
        const result: UpdateResult = await this.personRepository.update(id, person);

        if(result.affected == 0) throw new NotFoundException(`Usuário com Id: ${id} não encontrado.`);
        const personUpdated: Person = await this.personRepository.findOneBy( { id } );      

        return { 
            message: "Pessoa atualizada com sucesso",
            person: personUpdated,
            statusCode: HttpStatus.OK
        };
    }

    async delete(id: number): Promise<PersonResponse> {
        const deletePerson = await this.personRepository.delete(id)

        if(deletePerson.affected == 0) throw new NotFoundException(`Usuário com id: ${id} não existe.`)
        
        return {
            message: "Usuário deletado com sucesso.",
            statusCode: HttpStatus.OK  
        } 
    }

    async existCpf(cpf: string): Promise<Boolean> {
        return await this.personRepository.exists({ where: { cpf }}) 
        
    }

    async existEmail(email: string): Promise<Boolean> {
        return await this.personRepository.exists({ where: { email }})
    }

    async validPerson(email: string, cpf: string, phone: string): Promise<Boolean> {
        const existEmail = await this.personRepository.exists({ where: { email }})
        if(existEmail) return false

        const existCpf = await this.personRepository.exists({ where: { cpf }})
        if(existCpf) return false

        const existPhone = await this.personRepository.exists({ where: { phone }})
        if(existPhone) return false
       
        return true
    }
}
