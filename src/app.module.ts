import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Person } from './person/person.entity';
import { PersonController } from './person/person.controller';
import { PersonService } from './person/person.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';
import { Customer } from './customer/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:  process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Person, Customer],
      synchronize: true,
    }), TypeOrmModule.forFeature([User, Person, Customer])
  ],
  controllers: [AppController, UserController, PersonController, CustomerController],
  providers: [AppService, UserService, PersonService, CustomerService],
})
export class AppModule {
  constructor() {
    console.log('Database configuration:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`Username: ${process.env.DB_USERNAME}`);
    console.log(`Password: ${process.env.DB_PASSWORD ? '*****' : 'Not Set'}`);
    console.log(`Database: ${process.env.DB_NAME}`);
  }
}
