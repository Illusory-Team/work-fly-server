import { PickType } from '@nestjs/swagger';
import { MappedFolderAppearanceDataDto } from './mapped-folder-appearance-data.dto';

export class CreateFolderAppearanceDto extends PickType(MappedFolderAppearanceDataDto, ['icon', 'color'] as const) {}
