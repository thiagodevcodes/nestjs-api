import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Redirect, Req } from '@nestjs/common';
import { Customer } from './customer.entity';
import { CustomerResponse } from './interfaces/ResponseMessages';
import { CustomerService } from './customer.service';

@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(): Promise<Customer[]> {
    return await this.customerService.findAll();
  }

  @Get("find")
  async findById(@Query('id') id: string): Promise<Customer> {
    return this.customerService.findById(Number(id));
  }

  @Post()
  async insert(@Body() customer: Customer): Promise<CustomerResponse> {
    return this.customerService.insert(customer)
  }

  @Patch()
  async update(@Body() customer: Customer, @Query('id') id: string) {
    return this.customerService.update(customer, Number(id));
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.customerService.delete(Number(id));
  }
}
