import { IsEmail, IsString, IsNotEmpty, Length, IsNumber, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;
  
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNumber()
  @Min(100000)
  phone: number
}
