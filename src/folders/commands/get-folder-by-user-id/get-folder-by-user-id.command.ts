import { User } from '@prisma/client';

export class GetFolderByUserIdCommand {
  constructor(public readonly user: User) {}
}
