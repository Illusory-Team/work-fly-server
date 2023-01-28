import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

export class PatchCompanyDto extends PartialType(CreateCompanyDto) {
  @IsNumber()
  @Min(100000)
  @Max(1000000000000000)
  @IsOptional()
  phone?

  @IsEmail()
  @IsOptional()
  email?
  
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?
}
