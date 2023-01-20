import { ApiProperty } from '@nestjs/swagger';
import { TokensDto } from 'src/tokens/dto';
import { PureUserDto } from '../../users/dto/pure-user.dto';

export class UserDataDto {
  @ApiProperty({ description: 'User data without password' })
  user: PureUserDto;

  @ApiProperty({ description: 'User data without password' })
  tokens: TokensDto;
}
