import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateFolderAppearanceDto } from './dto';
import { CreateFolderAppearance } from './interfaces';
import { CreateFolderAppearanceCommand } from './commands';

@Injectable()
export class FolderAppearancesService {
  constructor(private readonly commandBus: CommandBus) {}

  async create(folderId: string, dto: CreateFolderAppearanceDto): Promise<CreateFolderAppearance> {
    return this.commandBus.execute(new CreateFolderAppearanceCommand(folderId, dto));
  }
}
