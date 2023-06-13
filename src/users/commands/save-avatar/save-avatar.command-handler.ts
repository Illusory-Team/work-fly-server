import { resolve } from 'path';
import { v4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveAvatarCommand } from './save-avatar.command';
import { PureUserDto } from 'users/dto';
import { PrismaService } from 'prisma/prisma.service';
import { FilesService } from 'files/files.service';

@CommandHandler(SaveAvatarCommand)
export class SaveAvatarCommandHandler implements ICommandHandler<SaveAvatarCommand> {
  constructor(private readonly prismaService: PrismaService, private readonly filesService: FilesService) {}

  async execute(command: SaveAvatarCommand): Promise<PureUserDto> {
    const { user, file } = command;

    const folderPath = resolve('static', 'users', user.id, 'avatar');
    if (user.avatar) {
      await this.filesService.removeFile(folderPath, user.avatar);
    }

    const fileName = v4() + '.jpg';
    await this.filesService.saveFile(folderPath, fileName, file);

    const updatedUser = await this.prismaService.user.update({ where: { id: user.id }, data: { avatar: fileName } });
    return new PureUserDto(updatedUser);
  }
}
