import { FolderDataDto } from './folder-data.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class PatchFolderDto extends PartialType(PickType(FolderDataDto, ['name'] as const)) {}
