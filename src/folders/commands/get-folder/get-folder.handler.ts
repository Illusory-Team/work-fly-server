import { Inject, forwardRef } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NOT_FOUND } from '@constants/error';
import { FolderAppearancesService } from 'folders/appearance/folder-appearances.service';
import { PrismaService } from 'prisma/prisma.service';
import { FolderDataDto, UglyFolderDataDto } from 'folders/dto';
import { FoldersSelector } from 'folders/folders.selector';
import { FoldersMapper } from 'folders/folders.mapper';
import { GetFolderCommand } from './get-folder.command';

@CommandHandler(GetFolderCommand)
export class GetFolderHandler implements ICommandHandler<GetFolderCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => FolderAppearancesService))
    private readonly folderAppearancesService: FolderAppearancesService,
  ) {}

  async execute(command: GetFolderCommand): Promise<FolderDataDto> {
    const { id } = command;

    const folderData: UglyFolderDataDto = await this.prismaService.folder.findUnique({
      where: { id },
      select: FoldersSelector.selectFolder(),
    });

    if (!folderData) {
      throw new NotFoundException(NOT_FOUND);
    }

    return FoldersMapper.mapFolderResponse(folderData);
  }
}
