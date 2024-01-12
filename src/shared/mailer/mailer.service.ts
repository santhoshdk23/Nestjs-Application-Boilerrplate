import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: 'sandbox.smtp.mailtrap.io' ,
      port: '2525',
      auth: {
        user: 'd4e3266452f2e7',
        pass: '5ff3e4d20a53bd',
      },
      debug: true,
      logger: false,
    });

    const options = {
      viewEngine: {
        extname: '.hbs', // handlebars extension
        layoutsDir:'/Users/Santhosh K/Desktop/Nest Js/nest-application/templates/emails',
        partialsDir:'/Users/Santhosh K/Desktop/Nest Js/nest-application/templates/emails',
        defaultLayout:'index.hbs'
      },
      viewPath: '/Users/Santhosh K/Desktop/Nest Js/nest-application/templates/emails',
      extName: '.hbs',
    };
    this.nodemailerTransport.use('compile', hbs(options));
  }

  sendMail(options: any) {
    return this.nodemailerTransport.sendMail(options);
  }
}
