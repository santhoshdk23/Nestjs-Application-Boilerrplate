import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/create-user.dto';

export class ForgotPasswordDto extends PickType(CreateUserDto, ['uname'] as const) {}
