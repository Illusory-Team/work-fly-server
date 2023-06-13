import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateFolderAppearanceDto, PatchFolderAppearanceDto, MappedFolderAppearanceDataDto } from './dto';
import { CreateFolderAppearance } from './interfaces';
import { User } from '@prisma/client';
import { CreateFolderAppearanceCommand, PatchFolderAppearanceCommand } from './commands';

@Injectable()
export class FolderAppearancesService {
  constructor(private readonly commandBus: CommandBus) {}

  async create(folderId: string, dto: CreateFolderAppearanceDto): Promise<CreateFolderAppearance> {
    return this.commandBus.execute(new CreateFolderAppearanceCommand(folderId, dto));
  }

  async patchOne(user: User, folderId: string, dto: PatchFolderAppearanceDto): Promise<MappedFolderAppearanceDataDto> {
    return this.commandBus.execute(new PatchFolderAppearanceCommand(user, folderId, dto));
  }
}
