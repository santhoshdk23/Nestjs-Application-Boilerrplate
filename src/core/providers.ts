import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../modules/auth/auth.service';
import { DatabaseModule } from '../database/database.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/authorization.guard';
import { AuthDao } from 'src/database/dao/auth.dao';
import { SessionService } from 'src/modules/auth/session.service';
// import { RolesGuard } from './guards/roles.guard';

const getProviders = (): any[] => {
		return [
			{ provide: APP_GUARD, useClass: AuthGuard },
			// { provide: APP_GUARD, useClass: RolesGuard },
			AuthService,AuthDao,
			JwtService,SessionService
		];
	},
	importProviders = (): any[] => {
		return [ConfigModule.forRoot(), DatabaseModule];
	},
	exportProviders = (): any[] => {
		return [ DatabaseModule];
	};
export { exportProviders, getProviders, importProviders };
