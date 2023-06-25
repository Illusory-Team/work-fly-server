import { User } from '@prisma/client';

export class SaveAvatarCommand {
  constructor(public readonly user: User, public readonly file: Express.Multer.File) {}
}
