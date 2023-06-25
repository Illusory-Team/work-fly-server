import { User } from '@prisma/client';
import { PatchFolderAppearanceDto } from 'folders/appearance/dto';

export class PatchFolderAppearanceCommand {
  constructor(
    public readonly user: User,
    public readonly folderId: string,
    public readonly dto: PatchFolderAppearanceDto,
  ) {}
}
