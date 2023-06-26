import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { UsersService } from 'users/users.service';
import { TokensService } from 'tokens/tokens.service';
import { PositionsService } from 'positions/positions.service';
import { AuthMapper } from 'auth/auth.mapper';
import { AuthReturn } from 'auth/auth.interface';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly positionsService: PositionsService,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthReturn> {
    const { refreshToken } = command;

    const userRefreshData = await this.tokensService.validateRefreshToken(refreshToken);
    if (!userRefreshData) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getById(userRefreshData.userId);
    const position = await this.positionsService.getById(user.positionId);

    const tokens = await this.tokensService.generateTokens(user.id);

    return AuthMapper.makeAuthResponse(user, position, tokens);
  }
}
