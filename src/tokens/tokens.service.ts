import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { GenerateTokensCommand, NullTokensCommand } from './commands';
import { GenerateTokensReturn } from './tokens.interface';
import { GetCSRFTokenFromRequestQuery, ValidateAccessTokenQuery, ValidateCSRFTokenQuery } from './queries';
import { ValidateRefreshTokenQuery } from './queries/validate-refresh-token';

@Injectable()
export class TokensService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async getCSRFTokenFromRequest(req: Request): Promise<string> {
    return this.queryBus.execute(new GetCSRFTokenFromRequestQuery(req));
  }

  async validateCSRFToken(csrfToken: string) {
    return this.queryBus.execute(new ValidateCSRFTokenQuery(csrfToken));
  }

  async nullTokens(refreshToken: string, csrfToken: string): Promise<void> {
    return this.commandBus.execute(new NullTokensCommand(refreshToken, csrfToken));
  }

  async generateTokens(userId: string): Promise<GenerateTokensReturn> {
    return this.commandBus.execute(new GenerateTokensCommand(userId));
  }

  async validateRefreshToken(refreshToken: string) {
    return this.queryBus.execute(new ValidateRefreshTokenQuery(refreshToken));
  }

  async validateAccessToken(accessToken: string) {
    return this.queryBus.execute(new ValidateAccessTokenQuery(accessToken));
  }
}
