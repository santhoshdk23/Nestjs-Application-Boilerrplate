import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { UtilsModule } from '../../shared/utils/utils.module';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { User, UserSchema } from 'src/database/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthDao } from 'src/database/dao/auth.dao';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), MailerModule, UtilsModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ForgotPasswordService,AuthDao
  ],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
