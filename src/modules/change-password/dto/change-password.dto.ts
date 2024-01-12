import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/create-user.dto';

export class ChangePasswordDto extends PickType(CreateUserDto, [
  'uname',
  'pwd',
] as const) {}
