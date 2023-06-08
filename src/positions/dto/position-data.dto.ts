import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';
import { ENTITY_ID } from '@constants/swagger';

export class PositionDataDto {
  @ApiProperty({ example: ENTITY_ID })
  id: string;

  @ApiProperty({ example: 'Owner', required: true })
  @IsString()
  @IsNotEmpty()
  value: string;

  constructor(model: Position) {
    this.id = model.id;
    this.value = model.value;
  }
}
