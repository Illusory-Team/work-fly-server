import { Inject, forwardRef } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFolderCommand } from './create-folder.command';
import { PrismaService } from 'prisma/prisma.service';
import { FolderTypesService } from 'folders/folder-types/folder-types.service';
import { FolderDataDto, UglyFolderDataDto } from 'folders/dto';
import { FolderAppearancesService } from 'folders/appearance/folder-appearances.service';
import { FoldersSelector } from 'folders/folders.selector';
import { FoldersMapper } from 'folders/folders.mapper';

@CommandHandler(CreateFolderCommand)
export class CreateFolderHandler implements ICommandHandler<CreateFolderCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => FolderAppearancesService))
    private readonly folderAppearancesService: FolderAppearancesService,
    private readonly folderTypesService: FolderTypesService,
  ) {}

  async execute(command: CreateFolderCommand): Promise<FolderDataDto> {
    const { user, dto } = command;

    const folderType = await this.folderTypesService.getByValue(dto.folderType);

    const folderData = await this.prismaService.folder.create({
      data: {
        name: dto.name,
        folderTypeId: folderType.id,
        companyId: user.companyId,
        ownerId: user.id,
      },
    });

    //it needs to create appearance entity after folder entity (requires its id)
    await this.folderAppearancesService.create(folderData.id, dto.folderAppearance);

    const updatedFolder: UglyFolderDataDto = await this.prismaService.folder.findUnique({
      where: { id: folderData.id },
      select: FoldersSelector.selectFolder(),
    });

    return FoldersMapper.mapFolderResponse(updatedFolder);
  }
}
