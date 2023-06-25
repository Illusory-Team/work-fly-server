import { User } from '@prisma/client';

export class RemoveAvatarCommand {
  constructor(public readonly user: User) {}
}
