import { User } from '@prisma/client';
import { PatchFolderDto } from 'folders/dto';

export class PatchFolderCommand {
  constructor(public readonly user: User, public readonly id: string, public readonly dto: PatchFolderDto) {}
}
