import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../database/schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.services';
import { UserDao } from '../../database/dao/user.dao';
import { MailerModule } from 'src/shared/mailer/mailer.module';
import { AuthDao } from 'src/database/dao/auth.dao';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { BcryptService } from 'src/shared/hashing/bcrypt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailerModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserDao,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthDao,
  ],
})
export class UserModule {}
