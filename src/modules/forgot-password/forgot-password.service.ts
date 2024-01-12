import { Injectable, Logger } from '@nestjs/common';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { AuthDao } from 'src/database/dao/auth.dao';
import { Model } from 'mongoose';
import { User } from 'src/database/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly authDao: AuthDao,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
    private readonly hashingService: HashingService,
  ) {}

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    const userUpdate = await this.authDao.findOneByUsername(
      forgotPasswordDto.uname,
    );
    const passwordRand = this.utilsService.generatePassword();
    userUpdate.pwd = await this.hashingService.hash(passwordRand);

    this.sendMailForgotPassword(userUpdate.uname, passwordRand);

    // Create an instance of the User model
    const userModelInstance = new this.userModel(userUpdate);

    // Use the save method on the instance
    return await userModelInstance.save();
  }

  private sendMailForgotPassword(uname, pwd): void {
    try {
      this.mailerService.sendMail({
        to: uname,
        from: 'from@example.com',
        subject: 'Forgot Password successful ✔',
        text: 'Forgot Password successful!',
        template: 'index',
        context: {
          title: 'Forgot Password successful!',
          description:
            'Request Reset Password Successfully!  ✔, This is your new password: ' +
            pwd,
        },
      });
      Logger.log('[MailService] Forgot Password: Send Mail successfully!');
    } catch (err) {
      Logger.error('[MailService] Forgot Password: Send Mail Failed!', err);
    }
  }
}
