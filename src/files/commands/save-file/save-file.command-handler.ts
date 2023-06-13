import { ensureDir } from 'fs-extra';
import { writeFile } from 'fs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveFileCommand } from './save-file.command';

@CommandHandler(SaveFileCommand)
export class SaveFileCommandHandler implements ICommandHandler<SaveFileCommand> {
  async execute(command: SaveFileCommand): Promise<string> {
    const { path, fileName, file } = command;

    await ensureDir(path);

    const filePath = `${path}\\${fileName}`;
    await writeFile(filePath, file.buffer, (err) => {
      if (err) throw err;
    });

    return fileName;
  }
}
