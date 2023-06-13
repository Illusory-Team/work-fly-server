import { ensureDir } from 'fs-extra';
import { unlink } from 'fs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveFileCommand } from './remove-file.command';

@CommandHandler(RemoveFileCommand)
export class RemoveFileCommandHandler implements ICommandHandler<RemoveFileCommand> {
  async execute(command: RemoveFileCommand): Promise<void> {
    const { path, fileName } = command;

    await ensureDir(path);

    const filePath = `${path}\\${fileName}`;
    await unlink(filePath, (err) => {
      if (err) throw err;
    });
  }
}
