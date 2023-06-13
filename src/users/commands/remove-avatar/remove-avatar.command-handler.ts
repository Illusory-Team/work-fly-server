import { resolve } from 'path';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NOT_FOUND } from '@constants/error';
import { PrismaService } from 'prisma/prisma.service';
import { FilesService } from 'files/files.service';
import { RemoveAvatarCommand } from './remove-avatar.command';
import { PureUserDto } from 'users/dto';

@CommandHandler(RemoveAvatarCommand)
export class RemoveAvatarCommandHandler implements ICommandHandler<RemoveAvatarCommand> {
  constructor(private readonly prismaService: PrismaService, private readonly filesService: FilesService) {}

  async execute(command: RemoveAvatarCommand): Promise<PureUserDto> {
    const { user } = command;

    if (!user.avatar) {
      throw new NotFoundException(NOT_FOUND);
    }

    const filePath = resolve('static', 'users', user.id, 'avatar');
    await this.filesService.removeFile(filePath, user.avatar);

    const updatedUser = await this.prismaService.user.update({ where: { id: user.id }, data: { avatar: null } });
    return new PureUserDto(updatedUser);
  }
}
