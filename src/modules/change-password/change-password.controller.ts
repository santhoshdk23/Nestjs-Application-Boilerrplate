import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ChangePasswordService } from './change-password.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/core/decorators/authorization.decorator';
// import { AuthGuard } from '../login/decorators/auth-guard.decorator';
// import { AuthType } from '../login/enums/auth-type.enum';

// @ApiTags('auth')
// @AuthGuard(AuthType.Bearer)
@Controller('auth')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Authorize()
  @Post('change-password')
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    try {
      await this.changePasswordService.changePassword(changePasswordDto);

      return {
        message: 'Request Change Password Successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Change password failed!');
    }
  }
}
