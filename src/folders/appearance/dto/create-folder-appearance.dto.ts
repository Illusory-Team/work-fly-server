import { PickType } from '@nestjs/swagger';
import { FolderAppearanceDataDto } from './folder-appearance-data.dto';

export class CreateFolderAppearanceDto extends PickType(FolderAppearanceDataDto, ['icon', 'color'] as const) {}
