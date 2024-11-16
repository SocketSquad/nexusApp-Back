import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get('email')
  async findByEmail(@Query('email') email: string) {
    const user = await this.userService.findByEmail(email);
    return user;
  }

  @Get('username')
  async findByUsername(@Query('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Put(':id/status')
  async updateOnlineStatus(
    @Param('id') id: string,
    @Body('isOnline') isOnline: boolean,
  ) {
    return this.userService.updateOnlineStatus(id, isOnline);
  }
}
