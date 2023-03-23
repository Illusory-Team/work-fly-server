import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FolderAppearanceDataDto {
  @ApiProperty({ example: 'cloud' })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({ example: '#c9c7ef' })
  @IsString()
  @IsNotEmpty()
  color: string;
}
