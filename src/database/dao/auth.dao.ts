// auth.dao.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';

@Injectable()
export class AuthDao {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ uname: username }).exec();
  }
}
