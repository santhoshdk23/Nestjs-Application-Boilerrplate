

// auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthDao } from '../../database/dao/auth.dao';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../../database/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { SessionSchema } from '../../database/schema/session.schema'; // Import the session schema here
import { SessionService } from './session.service'; // Import the session service here
 export const jwtsecretkey='your-secret-key'
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]), // Add the session schema here
    JwtModule.register({
      secret: jwtsecretkey,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthDao, AuthService, SessionService], // Include the SessionService
  controllers: [AuthController],
})
export class AuthModule {}


