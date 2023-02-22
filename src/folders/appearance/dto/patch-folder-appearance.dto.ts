import { FolderAppearanceDataDto } from './folder-appearance-data.dto';
import { PartialType, PickType } from '@nestjs/swagger';
export class PatchFolderAppearanceDto extends PartialType(
  PickType(FolderAppearanceDataDto, ['icon', 'color'] as const),
) {}
