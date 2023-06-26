import { User } from '@prisma/client';
import { PositionDataDto } from 'positions/dto';
import { PureRelationsUserDto, PureUserDto } from 'users/dto';
import { TokensDto } from 'tokens/dto';
import { AuthReturn } from './auth.interface';

export class AuthMapper {
  static makeAuthResponse(user: User, position: PositionDataDto, tokens: TokensDto): AuthReturn {
    const responseUser: PureRelationsUserDto = { ...new PureUserDto(user), position };

    return { data: { user: responseUser, accessToken: tokens.accessToken }, refreshToken: tokens.refreshToken };
  }
}
