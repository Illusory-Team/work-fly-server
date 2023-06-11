import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FolderType } from '@prisma/client';
import { GetFolderTypeByValueCommand } from './commands';

@Injectable()
export class FolderTypesService {
  constructor(private readonly commandBus: CommandBus) {}

  async getByValue(type: string): Promise<FolderType> {
    return this.commandBus.execute(new GetFolderTypeByValueCommand(type));
  }
}
