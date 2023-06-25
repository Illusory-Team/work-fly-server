import { QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FolderDataDto } from './dto';
import { GetFolderQuery } from './queries';

@Injectable()
export class FoldersService {
  constructor(private readonly queryBus: QueryBus) {}

  async getById(id: string): Promise<FolderDataDto> {
    return this.queryBus.execute(new GetFolderQuery(id));
  }
}
