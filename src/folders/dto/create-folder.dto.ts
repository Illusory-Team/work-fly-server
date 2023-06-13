import { PickType } from '@nestjs/swagger';
import { MappedFolderDataDto } from './mapped-folder-data.dto';

export class CreateFolderDto extends PickType(MappedFolderDataDto, ['name', 'folderType', 'folderAppearance']) {}
