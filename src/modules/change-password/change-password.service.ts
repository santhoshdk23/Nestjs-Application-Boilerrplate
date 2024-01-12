import { Injectable, Logger } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailerService } from '../../shared/mailer/mailer.service';
import { UserDao } from 'src/database/dao/user.dao';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly usersDao: UserDao,
    private readonly mailerService: MailerService,
  ) {}

  public async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    this.sendMailChangePassword(changePasswordDto);

    return await this.usersDao.updateByPassword(
      changePasswordDto.uname,
      changePasswordDto.pwd,
    );
  }

  private sendMailChangePassword(user): void {
    try {
      this.mailerService.sendMail({
        to: user.uname,
        from: 'from@example.com',
        subject: 'Change Password successful ✔',
        text: 'Change Password successful!',
        template: 'index',
        context: {
          title: 'Change Password successful!',
          description:
            'Change Password Successfully! ✔, This is your new password: ' +
            user.pwd,
          nameUser: user.name,
        },
      });
      Logger.log('[MailService] Change Password: Send Mail successfully!');
    } catch (err) {
      Logger.error('[MailService] Change Password: Send Mail Failed!', err);
    }
  }
}
