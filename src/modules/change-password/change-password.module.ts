import { Module } from '@nestjs/common';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { APP_GUARD } from '@nestjs/core';
// import { AuthenticationGuard } from '../login/guards/authentication/authentication.guard';
// import { AccessTokenGuard } from '../login/guards/access-token/access-token.guard';
import { JwtService } from '@nestjs/jwt';
// import { ConfigModule } from '@nestjs/config';
// import jwtConfig from '../login/config/jwt.config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schema/user.schema';
import { UserDao } from 'src/database/dao/user.dao';
import { AuthDao } from 'src/database/dao/auth.dao';

@Module({
  imports: [
    // ConfigModule.forFeature(jwtConfig),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailerModule,
  ],
  controllers: [ChangePasswordController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthenticationGuard,
    // },
    // AccessTokenGuard,
    ChangePasswordService,
    UserDao,AuthDao,
    JwtService,
  ],
})
export class ChangePasswordModule {}
