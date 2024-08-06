import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { UserResponse } from './interfaces/ResponseMessages';
import { Person } from 'src/person/person.entity';
import { PersonService } from 'src/person/person.service';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        
        private personService: PersonService
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findById(id: number): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ id })
        if(!user) throw new NotFoundException(`Usuário com o id: ${id} não encontrado.`)
    
        return user;
    }

    async insert(user: User): Promise<UserResponse> {
        const existingUser = await this.userRepository.findOne({ where: { username: user.username } });   
        if (existingUser) throw new ConflictException(`Usuário ${user.username} já existe`); 
        const savedUser = await this.userRepository.save(user);

        if (!savedUser) throw new InternalServerErrorException('Erro ao salvar o usuário.');
        
        return { 
            message: "Usuário criado com sucesso",
            user: savedUser,
            statusCode: HttpStatus.CREATED
        };
    }

    
    async update(user: User, id: number): Promise<UserResponse> {
        const existingUser = await this.userRepository.findOne({ where: { id }, relations: ['person'] });
        if (!existingUser) throw new NotFoundException(`Cliente com Id: ${id} não encontrado.`);
        

        if (user.person) {  
            const existingPerson = existingUser.person;   

            if (!existingPerson) throw new NotFoundException(`Pessoa relacionada ao cliente com Id: ${id} não encontrada.`);
            const existCpf = await this.personService.existCpf(user.person.cpf);
            const existEmail = await this.personService.existEmail(user.person.email);

            if(existCpf && user.person.cpf) throw new ConflictException("Já existe o CPF")
            if(existEmail && user.person.email) throw new ConflictException("Já existe o Email")
                   
            await this.personService.update({ ...existingPerson, ...user.person }, existingPerson.id);
        }

        const { person, ...userData } = user;
        await this.userRepository.update(id, { ...existingUser, ...userData });
    
        const userResult = await this.userRepository.findOne({ where: { id }, relations: ['person']});
    
        return { 
            message: "Cliente atualizado com sucesso",
            user: userResult,
            statusCode: HttpStatus.OK
        };
    }


    async delete(id: number): Promise<UserResponse> {
        const deleteUser = await this.userRepository.delete(id)

        if(deleteUser.affected == 0) throw new NotFoundException(`Usuário com id: ${id} não existe.`)
        
        return {
            message: "Usuário deletado com sucesso.",
            statusCode: HttpStatus.OK  
        } 
    }
}
