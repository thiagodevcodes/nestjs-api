import { IsNotEmpty, IsEmail, IsEmpty } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, Unique } from 'typeorm';

@Entity("tb_persons")
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  name: string;

  @Unique("UK_phone", ["phone"])
  @Column({ nullable: true })
  phone: string;

  @IsEmail()
  @Unique("UK_email", ["email"])
  @Column({ nullable: true })
  email: string;

  @Unique("UK_cpf", ["cpf"])
  @Column({ nullable: true })
  cpf: string;

  @OneToOne(() => User, (user) => user.person)
  user: User
}