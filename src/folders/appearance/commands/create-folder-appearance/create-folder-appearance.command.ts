import { CreateFolderAppearanceDto } from 'folders/appearance/dto';

export class CreateFolderAppearanceCommand {
  constructor(public readonly folderId: string, public readonly dto: CreateFolderAppearanceDto) {}
}
