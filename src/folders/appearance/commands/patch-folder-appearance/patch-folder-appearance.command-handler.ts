import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchFolderAppearanceCommand } from './patch-folder-appearance.command';
import { PrismaService } from 'prisma/prisma.service';
import { ColorsService } from 'colors/colors.service';
import { FolderIconsService } from 'folders/appearance/folder-icons/folder-icons.service';
import { FoldersService } from 'folders/folders.service';
import { FolderAppearanceDataDto, UglyFolderAppearanceDataDto } from 'folders/appearance/dto';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { NOTHING_PASSED, NOT_FOUND } from '@constants/error';
import { FolderAppearancesMapper } from 'folders/appearance/folder-appearances.mapper';

@CommandHandler(PatchFolderAppearanceCommand)
export class PatchFolderAppearanceCommandHandler implements ICommandHandler<PatchFolderAppearanceCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly colorsService: ColorsService,
    private readonly folderIconsService: FolderIconsService,
    private readonly foldersService: FoldersService,
  ) {}

  async execute(command: PatchFolderAppearanceCommand): Promise<FolderAppearanceDataDto> {
    const { user, folderId, dto } = command;

    if (Object.keys(dto).length < 1) {
      throw new BadRequestException(NOTHING_PASSED);
    }

    const folder = await this.foldersService.getById(folderId);

    if (folder.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    let color, icon;

    if (dto.color) {
      color = await this.colorsService.getByValue(dto.color);
      if (!color) {
        throw new NotFoundException(NOT_FOUND);
      }
    }
    if (dto.icon) {
      icon = await this.folderIconsService.getByValue(dto.icon);
      if (!icon) {
        throw new NotFoundException(NOT_FOUND);
      }
    }
    // such approach because if we provided the both
    // but icon would be incorrect => color update request would execute
    // but it would fail with icon not found exception
    if (color)
      await this.prismaService.folderAppearance.update({ where: { id: folderId }, data: { colorId: color.id } });
    if (icon) await this.prismaService.folderAppearance.update({ where: { id: folderId }, data: { iconId: icon.id } });

    const updatedAppearance: UglyFolderAppearanceDataDto = await this.prismaService.folderAppearance.findUnique({
      where: { id: folderId },
      select: { icon: { select: { icon: true } }, color: { select: { color: true } } },
    });

    return FolderAppearancesMapper.mapFolderAppearanceResponse(updatedAppearance);
  }
}
