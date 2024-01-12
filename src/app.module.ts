// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module'; // Import UserModule
import { DatabaseModule } from './database/database.module'; // Import DatabaseModule
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ForgotPasswordModule } from './modules/forgot-password/forgot-password.module';
import { ChangePasswordModule } from './modules/change-password/change-password.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [UserModule,ForgotPasswordModule, DatabaseModule,AuthModule,ChangePasswordModule,CoreModule], // Include both modules here
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
