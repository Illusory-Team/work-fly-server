import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FolderIcon } from '@prisma/client';
import { GetFolderIconByValueCommand } from './commands';

@Injectable()
export class FolderIconsService {
  constructor(private readonly commandBus: CommandBus) {}

  getByValue(icon: string): Promise<FolderIcon> {
    return this.commandBus.execute(new GetFolderIconByValueCommand(icon));
  }
}
