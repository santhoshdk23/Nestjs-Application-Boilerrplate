// auth.service.ts
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDao } from '../../database/dao/auth.dao';
import { SessionService } from './session.service'; // Import SessionService
import { Session } from '../../database/schema/session.schema'; // Import Session schema
import * as bcrypt from 'bcrypt';
import { SUCCESS_MESSAGES } from '../../shared/appmessage.shared';
import { jwtsecretkey } from './auth.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDao: AuthDao,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService, // Inject SessionService
  ) {}

  async login(username: string, password: string): Promise<any> {
    const user = await this.authDao.findOneByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.pwd))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the user already has an active session
    const activeSession = await this.sessionService.findActiveSession(user._id);

    if (activeSession) {
      // User is already logged in
      return {
        access_token: 'User is already logged in',
      };
    }

    const payload = {
      sub: user._id,
      name: user.name,
      roles: user.roles.map((role) => role.rname),
      username: user.uname,
    };

    const accessToken = this.jwtService.sign(payload);

    // Create a session
    const st = Date.now();
    const end = st + 20 * 60 * 1000;
    const sessionData: Partial<Session> = {
      uid: user._id,
      rid: user.roles[0].rid,
      rname: user.roles[0].rname,
      start_ts: st,
      end_ts: end,
    };

    const session = await this.sessionService.createSession(sessionData);

    // return {
    //   access_token: accessToken,
    // };
    return {
      access_token: accessToken,
      code: HttpStatus.OK,
      msg: SUCCESS_MESSAGES.LOGIN,
    };
  }

  async validateToken(token: string): Promise<any> {
		try {
			// const tokenMetadata = this._appConfigSvc.get('tokenMetadata');
			const jwtRes = await this.jwtService.verifyAsync(token, {
				secret:jwtsecretkey
			});
			return { code:HttpStatus.OK, msg:'Auth.S3', jwtRes};
		} catch (error) {
			return { code:HttpStatus.UNAUTHORIZED, msg:'UnAuth.S3'};
		}
	}

  async logout(token: string): Promise<any> {
    try {
      // Verify the token
      const decodedToken: any = this.jwtService.verify(token);

      // Find the active session for the user
      const activeSession = await this.sessionService.findActiveSession(
        decodedToken.sub,
      );

      if (activeSession) {
        // Set end_ts to the current date and time
        activeSession.end_ts = new Date();
        await this.sessionService.updateSession(activeSession);
      } else {
        return 'Already logged out';
      }

      return {
        code: HttpStatus.OK,
        msg: SUCCESS_MESSAGES.LOGOUT,
      };
    } catch (error) {
      console.error('Error during logout:', error);
      throw new UnauthorizedException('Logout failed');
    }
  }
}
