import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { UserResponse } from './interfaces/ResponseMessages';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findById(id: number): Promise<User> {
        const user: User = await this.usersRepository.findOneBy({ id })
        if(!user) throw new NotFoundException(`Usuário com o id: ${id} não encontrado.`)
    
        return user;
    }

    async insert(user: User): Promise<UserResponse> {
        const existingUser = await this.usersRepository.findOne({ where: { username: user.username } });   
        if (existingUser) throw new ConflictException(`Usuário ${user.username} já existe`); 
        const savedUser = await this.usersRepository.save(user);

        if (!savedUser) throw new InternalServerErrorException('Erro ao salvar o usuário.');
        
        return { 
            message: "Usuário criado com sucesso",
            user: savedUser,
            statusCode: HttpStatus.CREATED
        };
    }
    
    async update(user: User, id: number): Promise<UserResponse> {
        const result: UpdateResult = await this.usersRepository.update(id, user);

        if(result.affected == 0) throw new NotFoundException(`Usuário com Id: ${id} não encontrado.`);
        const userUpdated: User = await this.usersRepository.findOneBy( { id } );     
        
        return { 
            message: "Usuário atualizado com sucesso",
            user: userUpdated,
            statusCode: HttpStatus.OK
        };
    }

    async delete(id: number): Promise<UserResponse> {
        const deleteUser = await this.usersRepository.delete(id)

        if(deleteUser.affected == 0) throw new NotFoundException(`Usuário com id: ${id} não existe.`)
        
        return {
            message: "Usuário deletado com sucesso.",
            statusCode: HttpStatus.OK  
        } 
    }
}
