import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { TokensService } from 'tokens/tokens.service';
import { TokensDto } from 'tokens/dto';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(private readonly tokensService: TokensService) {}

  async execute(command: RefreshCommand): Promise<TokensDto> {
    const { refreshToken } = command;

    const userRefreshData = await this.tokensService.validateRefreshToken(refreshToken);
    if (!userRefreshData || !userRefreshData.userId) {
      throw new UnauthorizedException();
    }

    const tokens = await this.tokensService.generateTokens(userRefreshData.userId);

    return tokens;
  }
}
