// auth.controller.ts
import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Session } from 'src/database/schema/session.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    } else {
      return this.authService.logout(token);
    }
  }
}
