import { Inject, forwardRef } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FolderDataDto, UglyFolderDataDto } from 'folders/dto';
import { PrismaService } from 'prisma/prisma.service';
import { FolderAppearancesService } from 'folders/appearance/folder-appearances.service';
import { FoldersSelector } from 'folders/folders.selector';
import { FoldersMapper } from 'folders/folders.mapper';
import { GetFolderByUserIdCommand } from './get-folder-by-user-id.command';

@CommandHandler(GetFolderByUserIdCommand)
export class GetFolderByUserIdHandler implements ICommandHandler<GetFolderByUserIdCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => FolderAppearancesService))
    private readonly folderAppearancesService: FolderAppearancesService,
  ) {}

  async execute(command: GetFolderByUserIdCommand): Promise<FolderDataDto[]> {
    const { user } = command;

    const foldersData: UglyFolderDataDto[] = await this.prismaService.folder.findMany({
      where: { ownerId: user.id },
      select: FoldersSelector.selectFolder(),
    });

    return foldersData.map((folder) => FoldersMapper.mapFolderResponse(folder));
  }
}
