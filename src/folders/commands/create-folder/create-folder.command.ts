import { User } from '@prisma/client';
import { CreateFolderDto } from 'folders/dto';

export class CreateFolderCommand {
  constructor(public readonly user: User, public readonly dto: CreateFolderDto) {}
}
