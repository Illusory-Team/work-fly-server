import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateFolderDto, FolderDataDto, PatchFolderDto } from './dto';
import { User } from '@prisma/client';
import { CreateFolderCommand, GetFolderByUserIdCommand, GetFolderCommand, PatchFolderCommand } from './commands';

@Injectable()
export class FoldersService {
  constructor(private readonly commandBus: CommandBus) {}

  async create(user: User, dto: CreateFolderDto): Promise<FolderDataDto> {
    return this.commandBus.execute(new CreateFolderCommand(user, dto));
  }

  async getById(id: string): Promise<FolderDataDto> {
    return this.commandBus.execute(new GetFolderCommand(id));
  }

  async getByUserId(user: User): Promise<FolderDataDto[]> {
    return this.commandBus.execute(new GetFolderByUserIdCommand(user));
  }

  async patchOne(user: User, id: string, dto: PatchFolderDto): Promise<FolderDataDto> {
    return this.commandBus.execute(new PatchFolderCommand(user, id, dto));
  }
}
