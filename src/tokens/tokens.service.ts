import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { GenerateTokensCommand, ClearRefreshTokenCommand } from './commands';
import { ValidateAccessTokenQuery } from './queries';
import { ValidateRefreshTokenQuery } from './queries/validate-refresh-token';
import { TokensDto } from './dto';

@Injectable()
export class TokensService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async clearRefreshToken(refreshToken: string): Promise<void> {
    return this.commandBus.execute(new ClearRefreshTokenCommand(refreshToken));
  }

  async generateTokens(userId: string): Promise<TokensDto> {
    return this.commandBus.execute(new GenerateTokensCommand(userId));
  }

  async validateRefreshToken(refreshToken: string) {
    return this.queryBus.execute(new ValidateRefreshTokenQuery(refreshToken));
  }

  async validateAccessToken(accessToken: string) {
    return this.queryBus.execute(new ValidateAccessTokenQuery(accessToken));
  }
}
