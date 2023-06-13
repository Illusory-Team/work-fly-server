import { MappedFolderAppearanceDataDto } from './mapped-folder-appearance-data.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class PatchFolderAppearanceDto extends PartialType(
  PickType(MappedFolderAppearanceDataDto, ['icon', 'color'] as const),
) {}
