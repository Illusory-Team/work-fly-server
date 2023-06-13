import { MappedFolderAppearanceDataDto, FolderAppearanceDataDto } from './dto';

export class FolderAppearancesMapper {
  static mapFolderAppearanceResponse(folderAppearance: FolderAppearanceDataDto): MappedFolderAppearanceDataDto {
    return {
      // folder.folderAppearance = {icon, color}
      icon: folderAppearance.icon.icon,
      color: folderAppearance.color.color,
    };
  }
}
