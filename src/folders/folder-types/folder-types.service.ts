import { QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FolderType } from '@prisma/client';
import { GetFolderTypeByValueQuery } from './queries';

@Injectable()
export class FolderTypesService {
  constructor(private readonly queryBus: QueryBus) {}

  async getByValue(type: string): Promise<FolderType> {
    return this.queryBus.execute(new GetFolderTypeByValueQuery(type));
  }
}
