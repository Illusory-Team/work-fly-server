import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { TokensService } from 'tokens/tokens.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly tokensService: TokensService) {}

  async execute(command: LogoutCommand) {
    const { refreshToken, csrfToken } = command;

    if (!refreshToken || !csrfToken) {
      throw new UnauthorizedException();
    }
    await this.tokensService.nullTokens(refreshToken, csrfToken);
  }
}
