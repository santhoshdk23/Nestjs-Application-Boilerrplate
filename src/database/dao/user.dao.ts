// src/modules/user/user.dao.ts

import { Model } from 'mongoose';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { CreateUserDto } from '../../modules/user/create-user.dto';
import { PaginationDto } from 'src/modules/user/pagination.dto';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { AuthDao } from './auth.dao';

@Injectable()
export class UserDao {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailerService: MailerService,
    private readonly hashingService: HashingService,
    private readonly authDao: AuthDao,
  ) {}
  
  public async updateByPassword(
    uname: string,
    password: string,
  ): Promise<User> {
    const user = await this.authDao.findOneByUsername(uname);
    user.pwd = await this.hashingService.hash(password);

    const userModelInstance = new this.userModel(user);

    // Use the save method on the instance
    return await userModelInstance.save();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    this.sendMailRegisterUser(createUserDto);

    return await createdUser.save();
  }

  private sendMailRegisterUser(user): void {
    try {
      this.mailerService.sendMail({
        to: user.uname,
        from: 'vijaysanthu15@gmail.com',
        subject: 'Registration successful ✔',
        text: 'Registration successful!',
        template: 'index',
        context: {
          title: 'Registration successfully',
          description:
            "You did it! You registered!, You're successfully registered.✔",
          nameUser: user.name,
        },
      });
      Logger.log('[MailService] User Registration: Send Mail successfully!');
    } catch (err) {
      Logger.error('[MailService] User Registration: Send Mail failed!', err);
    }
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ uname: username }).exec();
  }

  async findOneById(id: string): Promise<User | null> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async deleteUser(userId: string): Promise<any> {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  async getAllUsers(pageId: number, pageLimit: number, name: string) {
    try {
      let query = this.userModel.find({});

      if (name) {
        query = query.regex('name', new RegExp(name, 'i'));
      }

      const users = await query

        .skip((pageId - 1) * pageLimit)

        .limit(pageLimit);

      const totalUsers = await this.userModel.countDocuments().exec();

      if (!users || users.length === 0) {
        throw new NotFoundException('No users found');
      }

      return {
        users,
        currentPage: pageId,
        usersPerPage: pageLimit,
        totalUsers,
      };
    } catch (error) {
      return 'Cant find';
    }
  }

  // You can add more methods for specific database operations as needed.
}
