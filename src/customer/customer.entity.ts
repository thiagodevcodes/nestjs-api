import { IsNotEmpty } from 'class-validator';
import { Person } from 'src/person/person.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, Unique, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity("tb_customers")
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  paymentDay: number;

  @Column({ default: true })
  isActive: string;

  @JoinColumn()
  @OneToOne(() => Person, (person) => person.user, { cascade: true })
  person: Person

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
