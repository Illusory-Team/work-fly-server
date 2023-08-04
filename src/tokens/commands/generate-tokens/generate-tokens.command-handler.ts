import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateTokensCommand } from './generate-tokens.command';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { TokensDto } from 'tokens/dto';

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensCommandHandler implements ICommandHandler<GenerateTokensCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: GenerateTokensCommand): Promise<TokensDto> {
    const { userId } = command;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
        },
        {
          secret: this.configService.get('ACCESS_SECRET_KEY'),
          expiresIn: this.configService.get('ACCESS_TIME'),
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
        },
        {
          secret: this.configService.get('REFRESH_SECRET_KEY'),
          expiresIn: this.configService.get('REFRESH_TIME'),
        },
      ),
    ]);

    await this.prismaService.token.upsert({
      where: { userId: userId },
      update: { userId, refreshToken },
      create: { userId, refreshToken },
    });

    return { accessToken, refreshToken };
  }
}
