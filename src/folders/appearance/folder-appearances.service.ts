import { FoldersService } from '../folders.service';
import { TokensService } from '../../tokens/tokens.service';
import { FolderIconsService } from './services/folder-icons.service';
import { ColorsService } from '../../colors/colors.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NOTHING_PASSED, NOT_FOUND } from 'src/common/constants';
import {
  CreateFolderAppearanceDto,
  PatchFolderAppearanceDto,
  UglyFolderAppearanceDataDto,
  FolderAppearanceDataDto,
} from './dto';
import { CreateFolderAppearance } from './interfaces';

@Injectable()
export class FolderAppearancesService {
  constructor(
    private prismaService: PrismaService,
    private colorsService: ColorsService,
    private folderIconsService: FolderIconsService,
    private tokensService: TokensService,
    private foldersService: FoldersService,
  ) {}

  async create(folderId: string, dto: CreateFolderAppearanceDto): Promise<CreateFolderAppearance> {
    const color = await this.colorsService.findByValue(dto.color);
    const icon = await this.folderIconsService.findByValue(dto.icon);
    if (!color || !icon) {
      throw new NotFoundException(NOT_FOUND);
    }

    return this.prismaService.folderAppearance.create({
      data: { id: folderId, colorId: color.id, iconId: icon.id },
    });
  }

  async patchOne(accessToken: string, id: string, dto: PatchFolderAppearanceDto): Promise<FolderAppearanceDataDto> {
    if (Object.keys(dto).length < 1) {
      throw new BadRequestException(NOTHING_PASSED);
    }

    const { userId } = this.tokensService.validateAccessToken(accessToken);
    const folder = await this.foldersService.findById(id);

    if (folder.owner.id !== userId) {
      throw new ForbiddenException();
    }

    let color, icon;

    if (dto.color) {
      color = await this.colorsService.findByValue(dto.color);
      if (!color) {
        throw new NotFoundException(NOT_FOUND);
      }
    }
    if (dto.icon) {
      icon = await this.folderIconsService.findByValue(dto.icon);
      if (!icon) {
        throw new NotFoundException(NOT_FOUND);
      }
    }
    // such approach because if we provided the both
    // but icon would be incorrect => color update request would execute
    // but it would fail with icon not found exception
    if (color) await this.prismaService.folderAppearance.update({ where: { id }, data: { colorId: color.id } });
    if (icon) await this.prismaService.folderAppearance.update({ where: { id }, data: { iconId: icon.id } });

    const updatedAppearance: UglyFolderAppearanceDataDto = await this.prismaService.folderAppearance.findUnique({
      where: { id },
      select: { icon: { select: { icon: true } }, color: { select: { color: true } } },
    });

    return this.makeFolderAppearanceResponse(updatedAppearance);
  }

  makeFolderAppearanceResponse(folderAppearanceData: UglyFolderAppearanceDataDto): FolderAppearanceDataDto {
    return {
      icon: folderAppearanceData.icon.icon,
      color: folderAppearanceData.color.color,
    };
  }
}
