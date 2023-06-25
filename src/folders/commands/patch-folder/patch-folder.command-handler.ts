import { ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchFolderCommand } from './patch-folder.command';
import { FolderDataDto, MappedFolderDataDto } from 'folders/dto';
import { PrismaService } from 'prisma/prisma.service';
import { FoldersSelector } from 'folders/folders.selector';
import { FoldersMapper } from 'folders/folders.mapper';

@CommandHandler(PatchFolderCommand)
export class PatchFolderCommandHandler implements ICommandHandler<PatchFolderCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: PatchFolderCommand): Promise<MappedFolderDataDto> {
    const { user, id, dto } = command;

    const folder = await this.prismaService.folder.findUnique({ where: { id }, select: { ownerId: true } });

    if (user.id !== folder.ownerId) {
      throw new ForbiddenException();
    }

    const updatedFolder: FolderDataDto = await this.prismaService.folder.update({
      where: { id },
      data: { ...dto },
      select: FoldersSelector.selectFolder(),
    });

    return FoldersMapper.mapFolderResponse(updatedFolder);
  }
}
