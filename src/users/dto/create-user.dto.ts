import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { POSITION } from '@constants/swagger';
import { PureUserDto } from './pure-user.dto';

export class CreateUserDto extends PickType(PureUserDto, ['email', 'fullName', 'phone', 'companyId'] as const) {
  @ApiProperty({ example: 'qwerty123', required: true, minLength: 8, maxLength: 30 })
  @IsString()
  @Length(8, 30)
  password: string;

  @ApiProperty({ description: POSITION, example: '1efe537f-e380-4168-959b-f864f2196369' })
  positionId: string;
}
