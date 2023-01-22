import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto';

export class UserSessionDto extends OmitType(CreateUserDto, ['companyId'] as const) {}
