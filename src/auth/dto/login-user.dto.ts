import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto';
export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}
