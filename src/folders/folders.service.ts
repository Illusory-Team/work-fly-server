import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateFolderDto, FolderDataDto, PatchFolderDto } from './dto';
import { User } from '@prisma/client';
import { CreateFolderCommand, PatchFolderCommand } from './commands';
import { GetFolderByUserIdQuery, GetFolderQuery } from './queries';

@Injectable()
export class FoldersService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async create(user: User, dto: CreateFolderDto): Promise<FolderDataDto> {
    return this.commandBus.execute(new CreateFolderCommand(user, dto));
  }

  async getById(id: string): Promise<FolderDataDto> {
    return this.queryBus.execute(new GetFolderQuery(id));
  }

  async getByUserId(user: User): Promise<FolderDataDto[]> {
    return this.queryBus.execute(new GetFolderByUserIdQuery(user));
  }

  async patchOne(user: User, id: string, dto: PatchFolderDto): Promise<FolderDataDto> {
    return this.commandBus.execute(new PatchFolderCommand(user, id, dto));
  }
}
