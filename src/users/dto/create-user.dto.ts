import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, Length, IsNumber, Min, Max } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({example: 'user@gmail.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({  example: 'qwerty123', required: true, minLength: 8, maxLength: 30 })
  @IsString()
  @Length(8, 30)
  password: string;

  @ApiProperty({ description: 'full name of user', example: 'Vladislav Makarov', required: true })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Work phone number',
    example: 89994377832,
    required: true,
    minimum: 100000,
    maximum: 1000000000000000,
  })
  @IsNumber()
  @Min(100000)
  @Max(1000000000000000)
  phone: number;
}
