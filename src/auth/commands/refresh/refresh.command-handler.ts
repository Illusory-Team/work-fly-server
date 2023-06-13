import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { UserReturnDto } from 'auth/dto';
import { PureRelationsUserDto, PureUserDto } from 'users/dto';
import { UsersService } from 'users/users.service';
import { TokensService } from 'tokens/tokens.service';
import { PositionsService } from 'positions/positions.service';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly positionsService: PositionsService,
  ) {}

  async execute(command: RefreshCommand): Promise<UserReturnDto> {
    const { refreshToken } = command;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const userRefreshData = await this.tokensService.validateRefreshToken(refreshToken);
    if (!userRefreshData) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getById(userRefreshData.userId);
    const position = await this.positionsService.getById(user.positionId);

    const tokens = await this.tokensService.generateTokens(user.id);

    const responseUser: PureRelationsUserDto = { ...new PureUserDto(user), position };
    const responseData = { user: responseUser, csrfToken: tokens.csrfToken };
    return { data: responseData, tokens: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken } };
  }
}
