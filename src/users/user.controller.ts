import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Redirect, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserResponse } from './interfaces/ResponseMessages';

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get("find")
  async findById(@Query('id') id: string): Promise<User> {
    return this.userService.findById(Number(id));
  }

  @Post()
  async insert(@Body() user: User): Promise<UserResponse> {
    return this.userService.insert(user)
  }

  @Patch()
  async update(@Body() user: User, @Query('id') id: string) {
    return this.userService.update(user, Number(id));
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
