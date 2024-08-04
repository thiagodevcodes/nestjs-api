import { Body, Controller, Delete, Get, Param, Post, Put, Query, Redirect, Req } from '@nestjs/common';
import { Person } from './person.entity';
import { PersonResponse } from './interfaces/ResponseMessages';
import { PersonService } from './person.service';

@Controller("persons")
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  async findAll(): Promise<Person[]> {
    return await this.personService.findAll();
  }

  @Get("find")
  async findById(@Query('id') id: string): Promise<Person> {
    return this.personService.findById(Number(id));
  }

  @Post()
  async insert(@Body() person: Person): Promise<PersonResponse> {
    return this.personService.insert(person)
  }

  @Put()
  async update(@Body() person: Person, @Query('id') id: string) {
    console.log(id)
    return this.personService.update(person, Number(id));
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.personService.delete(Number(id));
  }
}
