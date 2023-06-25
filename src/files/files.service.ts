import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { RemoveFileCommand, SaveFileCommand } from './commands';

@Injectable()
export class FilesService {
  constructor(private readonly commandBus: CommandBus) {}

  async saveFile(path: string, fileName: string, file: Express.Multer.File): Promise<string> {
    return this.commandBus.execute(new SaveFileCommand(path, fileName, file));
  }

  async removeFile(path: string, fileName: string): Promise<void> {
    return this.commandBus.execute(new RemoveFileCommand(path, fileName));
  }
}
