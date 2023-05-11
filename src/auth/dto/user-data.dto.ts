import { ApiProperty } from '@nestjs/swagger';
import { TokensDto } from 'tokens/dto';
import { PureRelationsUserDto } from 'users/dto';

export class UserDataDto {
  @ApiProperty({ description: 'User data without password' })
  user: PureRelationsUserDto;

  @ApiProperty({ description: 'Refresh and Access tokens' })
  tokens: TokensDto;
}
