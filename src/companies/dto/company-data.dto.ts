import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsPhoneNumber } from '@decorators/index';

export class CompanyDataDto {
  @ApiProperty({ example: '1efe537f-e380-4168-959b-f864f2196369' })
  id: string;

  @ApiProperty({ example: 'google', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Work phone number', example: '89994377832' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Office address', example: 'Brandon St 82, London' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Real google, not amazon' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
