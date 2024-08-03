import { Body, Controller, Delete, Get, Param, Post, Put, Query, Redirect, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreatedUserResponse } from './interfaces/CreatedUserResponse';

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get("find")
  async findById(@Query('id') id: string): Promise<User> {
    return this.userService.findById(Number(id));
  }

  @Post()
  async insert(@Body() user: User): Promise<CreatedUserResponse> {
    return this.userService.insert(user)
  }

  @Put()
  async update(@Body() user: User, @Query('id') id: string) {
    return this.userService.update(user, Number(id));
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
