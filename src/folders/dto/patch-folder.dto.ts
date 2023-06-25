import { MappedFolderDataDto } from './mapped-folder-data.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class PatchFolderDto extends PartialType(PickType(MappedFolderDataDto, ['name'] as const)) {}
