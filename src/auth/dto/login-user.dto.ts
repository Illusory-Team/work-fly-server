import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({ example: 'user@gmail.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'qwerty123', required: true, minLength: 8, maxLength: 30 })
  @IsString()
  @Length(8, 30)
  password: string;
}
