import { FolderAppearanceDataDto, UglyFolderAppearanceDataDto } from './dto';

export class FolderAppearancesMapper {
  static mapFolderAppearanceResponse(folderAppearance: UglyFolderAppearanceDataDto): FolderAppearanceDataDto {
    return {
      // folder.folderAppearance = {icon, color}
      icon: folderAppearance.icon.icon,
      color: folderAppearance.color.color,
    };
  }
}
