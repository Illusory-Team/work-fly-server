import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'users/dto';

export class UserSessionDto extends PickType(CreateUserDto, [
  'password',
  'email',
  'fullName',
  'phone',
  'companyId',
] as const) {}
