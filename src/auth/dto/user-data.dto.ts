import { ApiProperty } from '@nestjs/swagger';
import { POSITION } from 'src/common/constants';
import { PositionDataDto } from 'src/positions/dto';
import { TokensDto } from 'src/tokens/dto';
import { PureUserDto } from '../../users/dto/pure-user.dto';

export class UserDataDto {
  @ApiProperty({ description: 'User data without password' })
  user: PureUserDto;

  @ApiProperty({ description: 'Refresh and Access tokens' })
  tokens: TokensDto;

  @ApiProperty({ description: POSITION })
  position: PositionDataDto
}
