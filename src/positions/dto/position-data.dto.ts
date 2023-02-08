import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class PositionDataDto {
  @ApiProperty({ example: '1efe537f-e380-4168-959b-f864f2196369' })
  id: string;

  @ApiProperty({ example: 'google', required: true })
  @IsString()
  @IsNotEmpty()
  value: string;

  constructor(model: Position) {
    this.id = model.id;
    this.value = model.value;
  }
}
