import { BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchFolderCommand } from './patch-folder.command';
import { FolderDataDto, UglyFolderDataDto } from 'folders/dto';
import { NOTHING_PASSED } from '@constants/error';
import { PrismaService } from 'prisma/prisma.service';
import { FolderAppearancesService } from 'folders/appearance/folder-appearances.service';
import { FoldersSelector } from 'folders/folders.selector';
import { FoldersMapper } from 'folders/folders.mapper';

@CommandHandler(PatchFolderCommand)
export class PatchFolderHandler implements ICommandHandler<PatchFolderCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => FolderAppearancesService))
    private readonly folderAppearancesService: FolderAppearancesService,
  ) {}

  async execute(command: PatchFolderCommand): Promise<FolderDataDto> {
    const { user, id, dto } = command;

    if (Object.keys(dto).length < 1) {
      throw new BadRequestException(NOTHING_PASSED);
    }

    const folder = await this.prismaService.folder.findUnique({ where: { id }, select: { ownerId: true } });

    if (user.id !== folder.ownerId) {
      throw new ForbiddenException();
    }

    const updatedFolder: UglyFolderDataDto = await this.prismaService.folder.update({
      where: { id },
      data: { ...dto },
      select: FoldersSelector.selectFolder(),
    });

    return FoldersMapper.mapFolderResponse(updatedFolder);
  }
}
