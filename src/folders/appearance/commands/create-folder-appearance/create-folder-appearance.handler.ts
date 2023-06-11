import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { ColorsService } from 'colors/colors.service';
import { FolderIconsService } from 'folders/appearance/folder-icons/folder-icons.service';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND } from '@constants/error';
import { CreateFolderAppearance } from 'folders/appearance/interfaces';
import { CreateFolderAppearanceCommand } from './create-folder-appearance.command';

@CommandHandler(CreateFolderAppearanceCommand)
export class CreateFolderAppearanceHandler implements ICommandHandler<CreateFolderAppearanceCommand> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly colorsService: ColorsService,
    private readonly folderIconsService: FolderIconsService,
  ) {}

  async execute(command: CreateFolderAppearanceCommand): Promise<CreateFolderAppearance> {
    const { folderId, dto } = command;

    const color = await this.colorsService.getByValue(dto.color);
    const icon = await this.folderIconsService.getByValue(dto.icon);
    if (!color || !icon) {
      throw new NotFoundException(NOT_FOUND);
    }

    return this.prismaService.folderAppearance.create({
      data: { id: folderId, colorId: color.id, iconId: icon.id },
    });
  }
}
