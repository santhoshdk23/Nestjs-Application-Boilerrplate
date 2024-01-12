// src/modules/user/user.service.ts

import { ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserDao } from '../../database/dao/user.dao';
import { CreateUserDto } from './create-user.dto';
import { User } from '../../database/schema/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'; // Import JWT library
import { jwtsecretkey } from '../auth/auth.module';
import { PaginationDto } from './pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SUCCESS_MESSAGES } from '../../shared/appmessage.shared';



@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userDao.findOneByUsername(createUserDto.uname);

    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.pwd, 10);

    // Create the user
    const user = await this.userDao.createUser({ ...createUserDto, pwd: hashedPassword });

    if (!user) {
      throw new NotFoundException('User not found after registration');
    }

    return user;
  }
  

  async getAllUsers(): Promise<User[]> {
    return this.userDao.findAllUsers();
  }


  async updateUser(token: string, updateUserDto:CreateUserDto): Promise<User> {
    // Verify the token
    const decodedToken: any = jwt.verify(token,  jwtsecretkey);

 

    // Find the user based on token and update the user data
    const user = await this.userDao.findOneById(decodedToken.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

 

    // Update the user data
    // user.name = updateUserDto.name;
    // Update other fields as needed

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }
    // Update other fields as needed, for example:
    if (updateUserDto.emp_id) {
      user.emp_id = updateUserDto.emp_id;
    }
    if (updateUserDto.uname) {
      user.uname = updateUserDto.uname;
    }

 

    // Save the updated user data
    return await user.save();
    
  }

 

  async deleteUser(token: string, userId: string): Promise<any> {
    try {
      // Verify the token
      const decodedToken: any = jwt.verify(token,  jwtsecretkey);
  
      // Ensure the user making the request is authorized to delete the user
      if (decodedToken.sub !== userId) {
        throw new UnauthorizedException('Unauthorized to delete this user');
      }
  
      // Find the user by ID
      const user = await this.userDao.findOneById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Delete the user
        await this.userDao.deleteUser(userId);
        return {
          code: HttpStatus.OK,
          msg: SUCCESS_MESSAGES.DELETED,
        };
    } catch (error) {
      // Handle errors such as token validation errors
      throw new UnauthorizedException('Unauthorized to delete this user');
    }
  }

 
  public async getPaginatedUsers(page: number, limit: number, name: string) {

    try {

        const users = await this.userDao.getAllUsers(page, limit, name);

        return users;

    } catch (error) {

        return "cant find";

    }

  }
}
