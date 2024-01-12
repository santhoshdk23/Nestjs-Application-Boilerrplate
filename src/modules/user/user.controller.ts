// src/modules/user/user.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Delete,
  Param,
  Req,
  UnauthorizedException,
  Patch,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDto } from './create-user.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { PaginationDto } from './pagination.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async registerUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch('update')
  @ApiBearerAuth() // Add this decorator if you use JWT authentication
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateUser(
    @Req() req: Request,
    @Body(new ValidationPipe()) updateUserDto: CreateUserDto,
  ) {
    // Get the token from the request headers
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.userService.updateUser(token, updateUserDto);
  }

  @Delete('delete/:id')
  async deleteUser(@Req() req: Request, @Param('id') id: string) {
    // Get the token from the request headers
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.userService.deleteUser(token, id);
  }

  @Get('getusers')
  public async getUsers(
    @Query('pageId') pageId: number = 1,

    @Query('pageLimit') pageLimit: number = 10,

    @Query('name') name: string,

    @Res() res: any,
  ) {
    const users = await this.userService.getPaginatedUsers(
      pageId,
      pageLimit,
      name,
    );

    return res.send({
      message: 'success',

      users,
    });
  }
}
