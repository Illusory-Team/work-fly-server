import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto';

export class UserSessionDto extends PickType(CreateUserDto, ['password', 'email', 'fullName', 'phone']) {}
