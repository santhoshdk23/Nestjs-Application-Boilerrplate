// src/database/database.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from './connection'; // Import DatabaseConnection class

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: DatabaseConnection, // Use the DatabaseConnection class for configuration
    }),
  ],
})
export class DatabaseModule {}
