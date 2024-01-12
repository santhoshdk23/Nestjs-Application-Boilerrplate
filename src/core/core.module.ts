import { Global, Module } from '@nestjs/common';
import { exportProviders, getProviders, importProviders } from './providers';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/authorization.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthDao } from 'src/database/dao/auth.dao';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/modules/auth/session.service';
import { DatabaseModule } from 'src/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schema/user.schema';
import { SessionSchema } from 'src/database/schema/session.schema';

@Global()
@Module({
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    AuthService,
    AuthDao,
    JwtService,
    SessionService,
  ],
  imports: [ MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
  DatabaseModule],
  exports: [DatabaseModule],
})
export class CoreModule {}
