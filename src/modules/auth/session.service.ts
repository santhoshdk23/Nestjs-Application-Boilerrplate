// session.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from '../../database/schema/session.schema';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session') private readonly sessionModel: Model<Session>,
  ) {}

  async findActiveSession(userId: string): Promise<any> {
    // Define a query to find an active session for the given user
    const query = {
      uid: userId,
      end_ts: { $gt: Date.now() }, // Check if end_ts is greater than the current timestamp
    };

    // Use the Mongoose model to find the session
    return this.sessionModel.findOne(query).exec();
  }

  async createSession(sessionData: Partial<Session>): Promise<Session> {
    const session = new this.sessionModel(sessionData);
    return session.save();
  }

  // async findActiveSession1(userId: string): Promise<Session | null> {
  //   return this.sessionModel.findOne({ uid: userId, end_ts: null }).exec();
  // }

  async updateSession(session: Session): Promise<void> {
    await session.save();
  }
}
