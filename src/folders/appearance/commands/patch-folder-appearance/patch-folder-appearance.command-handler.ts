import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchFolderAppearanceCommand } from './patch-folder-appearance.command';
import { PrismaService } from 'prisma/prisma.service';
import { ColorsService } from 'colors/colors.service';
import { FolderIconsService } from 'folders/appearance/folder-icons/folder-icons.service';
import { FoldersService } from 'folders/folders.service';
import { MappedFolderAppearanceDataDto, FolderAppearanceDataDto } from 'folders/appearance/dto';
import { ForbiddenException } from '@nestjs/common';
import { FolderAppearancesMapper } from 'folders/appearance/folder-appearances.mapper';

@CommandHandler(PatchFolderAppearanceCommand)
export class PatchFolderAppearanceCommandHandler implements ICommandHandler<PatchFolderAppearanceCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly colorsService: ColorsService,
    private readonly folderIconsService: FolderIconsService,
    private readonly foldersService: FoldersService,
  ) {}

  async execute(command: PatchFolderAppearanceCommand): Promise<MappedFolderAppearanceDataDto> {
    const { user, folderId, dto } = command;

    const folder = await this.foldersService.getById(folderId);

    if (folder.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    let color, icon;

    if (dto.color) {
      color = await this.colorsService.getByValue(dto.color);
    }
    if (dto.icon) {
      icon = await this.folderIconsService.getByValue(dto.icon);
    }
    // such approach because if we provided the both
    // but icon would be incorrect => color update request would execute
    // but it would fail with icon not found exception
    if (color)
      await this.prismaService.folderAppearance.update({ where: { id: folderId }, data: { colorId: color.id } });
    if (icon) {
      await this.prismaService.folderAppearance.update({ where: { id: folderId }, data: { iconId: icon.id } });
    }

    const updatedAppearance: FolderAppearanceDataDto = await this.prismaService.folderAppearance.findUnique({
      where: { id: folderId },
      select: { icon: { select: { icon: true } }, color: { select: { color: true } } },
    });

    return FolderAppearancesMapper.mapFolderAppearanceResponse(updatedAppearance);
  }
}
