import { User } from '@prisma/client';

export class GetFolderByUserIdQuery {
  constructor(public readonly user: User) {}
}
