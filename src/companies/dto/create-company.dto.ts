import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'google', required: true})
  @IsString()
  @IsNotEmpty()
  name: string;
}
