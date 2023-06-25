import { User } from '@prisma/client';
import { PositionDataDto } from 'positions/dto';
import { GenerateTokensReturn } from 'tokens/tokens.interface';
import { PureRelationsUserDto, PureUserDto } from 'users/dto';

export class AuthMapper {
  static makeAuthResponse(user: User, position: PositionDataDto, tokens: GenerateTokensReturn) {
    const responseUser: PureRelationsUserDto = { ...new PureUserDto(user), position };
    const responseData = { user: responseUser, csrfToken: tokens.csrfToken };

    return { data: responseData, tokens: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken } };
  }
}
