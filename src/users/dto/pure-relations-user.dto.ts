import { ApiProperty } from '@nestjs/swagger';
import { PureUserDto } from './pure-user.dto';
import { POSITION } from 'src/common/constants';
import { PositionDataDto } from 'src/positions/dto';

export class PureRelationsUserDto extends PureUserDto {
  @ApiProperty({ description: POSITION })
  position: PositionDataDto;
}
