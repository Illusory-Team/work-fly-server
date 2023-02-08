import { PositionDataDto } from 'src/positions/dto';
import { PureUserDto } from './pure-user.dto';

export class FindUserDto {
  user: PureUserDto
  position: PositionDataDto
}