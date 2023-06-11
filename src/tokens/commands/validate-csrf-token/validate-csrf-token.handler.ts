import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateCSRFTokenCommand } from './validate-csrf-token.command';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';

@CommandHandler(ValidateCSRFTokenCommand)
export class ValidateCSRFTokenHandler implements ICommandHandler<ValidateCSRFTokenCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: ValidateCSRFTokenCommand) {
    try {
      const { csrfToken } = command;

      // throws error when it's invalid or expired
      const tokenData = this.jwtService.verify(csrfToken, { secret: this.configService.get('CSRF_SECRET_KEY') });

      const token = await this.prismaService.cSRFToken.findUnique({ where: { csrfToken } });
      if (!token) {
        throw new UnauthorizedException();
      }

      return tokenData;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
