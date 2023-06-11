import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateTokensCommand } from './generate-tokens.command';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensReturn } from 'tokens/tokens.interface';
import { PrismaService } from 'prisma/prisma.service';

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensHandler implements ICommandHandler<GenerateTokensCommand> {
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
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync({ userId }, { secret: this.configService.get('CSRF_SECRET_KEY'), expiresIn: '15m' }),
      this.jwtService.signAsync(
        {
          userId,
        },
        {
          secret: this.configService.get('REFRESH_SECRET_KEY'),
          expiresIn: '7d',
        },
      ),
    ]);

    await this.saveCSRFToken(userId, csrfToken);
    await this.saveRefreshToken(userId, refreshToken);

    return { accessToken, csrfToken, refreshToken };
  }

  private async saveCSRFToken(userId: string, csrfToken: string): Promise<void> {
    const tokenData = await this.prismaService.cSRFToken.findUnique({
      where: { userId },
    });

    if (tokenData) {
      await this.prismaService.cSRFToken.update({
        where: { userId: tokenData.userId },
        data: { ...tokenData, csrfToken },
      });
    } else {
      await this.prismaService.cSRFToken.create({
        data: { userId, csrfToken },
      });
    }
  }

  private async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const tokenData = await this.prismaService.token.findUnique({
      where: { userId },
    });
    if (tokenData) {
      await this.prismaService.token.update({
        where: { userId: tokenData.userId },
        data: { ...tokenData, refreshToken },
      });
    } else {
      await this.prismaService.token.create({
        data: { userId, refreshToken },
      });
    }
  }
}
