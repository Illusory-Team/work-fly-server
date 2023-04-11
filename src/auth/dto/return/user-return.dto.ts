import { ApiProperty } from '@nestjs/swagger';
import { TokensDto } from 'src/tokens/dto';
import { PureRelationsUserDto } from 'src/users/dto';

export class UserReturnDto {
  @ApiProperty({ description: 'User data without password' })
  user: PureRelationsUserDto;

  @ApiProperty({ description: 'Refresh and Access tokens' })
  tokens: TokensDto;
}
