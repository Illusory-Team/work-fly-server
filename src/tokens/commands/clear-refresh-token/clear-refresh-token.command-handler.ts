import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { ClearRefreshTokenCommand } from './clear-refresh-token.command';
import { UnauthorizedException } from '@nestjs/common';

@CommandHandler(ClearRefreshTokenCommand)
export class ClearRefreshTokenCommandHandler implements ICommandHandler<ClearRefreshTokenCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: ClearRefreshTokenCommand): Promise<void> {
    const { refreshToken } = command;

    const currentRefreshEntity = await this.prismaService.token.findUnique({
      where: { refreshToken },
    });
    if (!currentRefreshEntity || currentRefreshEntity.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    await this.prismaService.token.update({
      where: { refreshToken },
      data: { refreshToken: null },
    });
  }
}
