import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { ClearTokensCommand } from './clear-tokens.command';
import { UnauthorizedException } from '@nestjs/common';

@CommandHandler(ClearTokensCommand)
export class ClearTokensCommandHandler implements ICommandHandler<ClearTokensCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: ClearTokensCommand): Promise<void> {
    const { refreshToken, csrfToken } = command;

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

    const currentCsrfEntity = await this.prismaService.cSRFToken.findUnique({
      where: { csrfToken },
    });
    if (!currentCsrfEntity || currentCsrfEntity.csrfToken !== csrfToken) {
      throw new UnauthorizedException();
    }

    await this.prismaService.cSRFToken.update({
      where: { csrfToken },
      data: { csrfToken: null },
    });
  }
}
