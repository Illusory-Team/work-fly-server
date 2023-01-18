import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { PureUserDto } from './pure-user.dto';

export class CreateUserDto extends PickType(PureUserDto, ['email', 'fullName', 'phone'] as const) {
  @ApiProperty({ example: 'qwerty123', required: true, minLength: 8, maxLength: 30 })
  @IsString()
  @Length(8, 30)
  password: string;
}
