import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  GetCSRFTokenFromRequestCommand,
  ValidateCSRFTokenCommand,
  GenerateTokensCommand,
  NullTokensCommand,
  ValidateRefreshTokenCommand,
  ValidateAccessTokenCommand,
} from './commands';
import { GenerateTokensReturn } from './tokens.interface';

@Injectable()
export class TokensService {
  constructor(private readonly commandBus: CommandBus) {}

  async getCSRFTokenFromRequest(req: Request): Promise<string> {
    return this.commandBus.execute(new GetCSRFTokenFromRequestCommand(req));
  }

  async validateCSRFToken(csrfToken: string) {
    return this.commandBus.execute(new ValidateCSRFTokenCommand(csrfToken));
  }

  async nullTokens(refreshToken: string, csrfToken: string): Promise<void> {
    return this.commandBus.execute(new NullTokensCommand(refreshToken, csrfToken));
  }

  async generateTokens(userId: string): Promise<GenerateTokensReturn> {
    return this.commandBus.execute(new GenerateTokensCommand(userId));
  }

  async validateRefreshToken(refreshToken: string) {
    return this.commandBus.execute(new ValidateRefreshTokenCommand(refreshToken));
  }

  async validateAccessToken(accessToken: string) {
    return this.commandBus.execute(new ValidateAccessTokenCommand(accessToken));
  }
}
