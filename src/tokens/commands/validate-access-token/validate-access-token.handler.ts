import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateAccessTokenCommand } from './validate-access-token.command';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@CommandHandler(ValidateAccessTokenCommand)
export class ValidateAccessTokenHandler implements ICommandHandler<ValidateAccessTokenCommand> {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async execute(command: ValidateAccessTokenCommand) {
    const { accessToken } = command;

    return this.jwtService.verify(accessToken, { secret: this.configService.get<string>('ACCESS_SECRET_KEY') });
  }
}
