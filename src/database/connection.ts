// src/modules/user/database/connection.ts

import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

export class DatabaseConnection implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: process.env.MONGODB_URI, // Use the environment variable
      // uri:"mongodb://127.0.0.1:27017/nest-api"
    };
  }
}
