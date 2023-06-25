import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateTokensCommand } from './generate-tokens.command';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensReturn } from 'tokens/tokens.interface';
import { PrismaService } from 'prisma/prisma.service';
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from 'tokens/tokens.constants';

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensCommandHandler implements ICommandHandler<GenerateTokensCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: GenerateTokensCommand): Promise<GenerateTokensReturn> {
    const { userId } = command;

    const [accessToken, csrfToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
        },
        {
          secret: this.configService.get('ACCESS_SECRET_KEY'),
          expiresIn: ACCESS_TOKEN_TIME,
        },
      ),
      this.jwtService.signAsync(
        { userId },
        { secret: this.configService.get('CSRF_SECRET_KEY'), expiresIn: ACCESS_TOKEN_TIME },
      ),
      this.jwtService.signAsync(
        {
          userId,
        },
        {
          secret: this.configService.get('REFRESH_SECRET_KEY'),
          expiresIn: REFRESH_TOKEN_TIME,
        },
      ),
    ]);

    await this.prismaService.cSRFToken.upsert({
      where: { userId },
      update: { userId, csrfToken },
      create: { userId, csrfToken },
    });
    await this.prismaService.token.upsert({
      where: { userId: userId },
      update: { userId, refreshToken },
      create: { userId, refreshToken },
    });

    return { accessToken, csrfToken, refreshToken };
  }
}
