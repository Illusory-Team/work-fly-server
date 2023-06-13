import { QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FolderIcon } from '@prisma/client';
import { GetFolderIconByValueQuery } from './queries';

@Injectable()
export class FolderIconsService {
  constructor(private readonly queryBus: QueryBus) {}

  getByValue(icon: string): Promise<FolderIcon> {
    return this.queryBus.execute(new GetFolderIconByValueQuery(icon));
  }
}
