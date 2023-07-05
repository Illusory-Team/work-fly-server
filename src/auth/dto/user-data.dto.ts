import { ApiProperty, PickType } from '@nestjs/swagger';
import { TokensDto } from 'tokens/dto';
import { PureRelationsUserDto } from 'users/dto';

export class UserDataDto extends PickType(TokensDto, ['accessToken']) {
  @ApiProperty({ description: 'User data without password' })
  user: PureRelationsUserDto;
}
