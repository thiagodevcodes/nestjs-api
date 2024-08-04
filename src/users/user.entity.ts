import { IsNotEmpty } from 'class-validator';
import { Person } from 'src/person/person.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Unique } from 'typeorm';

@Entity("tb_users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Unique("UK_username", ["username"])
  @Column()
  username: string;

  @IsNotEmpty()
  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @IsNotEmpty()
  @JoinColumn()
  @OneToOne(() => Person, (person) => person.user, { cascade: true })
  person: Person
}