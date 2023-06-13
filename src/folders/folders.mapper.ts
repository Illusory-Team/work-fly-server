import { FolderAppearancesMapper } from './appearance/folder-appearances.mapper';
import { FolderDataDto, MappedFolderDataDto } from './dto';

export class FoldersMapper {
  static mapFolderResponse(folder: FolderDataDto): MappedFolderDataDto {
    return {
      ...folder,
      users: folder.users.map((userWrappedObj) => userWrappedObj.users), // users[0] = users[0].users
      folderAppearance: FolderAppearancesMapper.mapFolderAppearanceResponse(folder.folderAppearance),
      folderType: folder.folderType.type, // folder.folderType = folder.folderType.type
    };
  }
}
