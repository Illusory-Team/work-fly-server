import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateRefreshTokenCommand } from './validate-refresh-token.command';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@CommandHandler(ValidateRefreshTokenCommand)
export class ValidateRefreshTokenHandler implements ICommandHandler<ValidateRefreshTokenCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: ValidateRefreshTokenCommand) {
    const { refreshToken } = command;

    const tokenFromDb = await this.prismaService.token.findUnique({ where: { refreshToken } });
    if (!tokenFromDb) {
      throw new UnauthorizedException();
    }

    return this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('REFRESH_SECRET_KEY') });
  }
}
