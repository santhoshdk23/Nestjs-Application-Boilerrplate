// src/database/session.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Session extends Document {
  @Prop()
  uid: string;

  @Prop()
  rid: number;

  @Prop()
  rname: string;

  @Prop()
  start_ts: number;

  @Prop()
  end_ts: number;

  @Prop()
  created_at: number;

  @Prop()
  updated_at: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
