import { ApiProperty } from '@nestjs/swagger';
import { PureUserDto } from './pure-user.dto';
import { POSITION } from '@constants/swagger';
import { PositionDataDto } from 'src/positions/dto';

export class PureRelationsUserDto extends PureUserDto {
  @ApiProperty({ description: POSITION })
  position: PositionDataDto;
}
