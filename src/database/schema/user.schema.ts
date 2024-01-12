import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class UserRole {
  @Prop()
  rid: number;

  @Prop()
  rname: string;

  //   @Prop()
  //   start_ts: number;

  //   @Prop()
  //   end_ts: number;
}

@Schema({ timestamps: true })
export class User extends Document {
  //   @Prop({ type: MongooseSchema.Types.ObjectId, unique: true })
  //   _id: MongooseSchema.Types.ObjectId;

  @Prop()
  sub: string; // Define the 'sub' property

  @Prop()
  name: string;

  @Prop()
  emp_id: string;

  @Prop({ unique: true })
  uname: string;

  @Prop()
  pwd: string;

  @Prop()
  comm_email: string;

  @Prop()
  dept: string;

  @Prop([UserRole])
  roles: UserRole[];

  @Prop()
  active: boolean;

  @Prop()
  created_at: number;

  @Prop()
  updated_at: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
