import { PickType } from "@nestjs/swagger";
import { FolderDataDto } from "./folder-data.dto";

export class CreateFolderDto extends PickType(FolderDataDto, ['name', 'folderType', 'folderAppearance']) {}