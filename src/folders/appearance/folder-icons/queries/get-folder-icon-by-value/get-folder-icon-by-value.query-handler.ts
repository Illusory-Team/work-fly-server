import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { GetFolderIconByValueQuery } from './get-folder-icon-by-value.command';
import { FolderIcon } from '@prisma/client';

@QueryHandler(GetFolderIconByValueQuery)
export class GetFolderIconByValueQueryHandler implements IQueryHandler<GetFolderIconByValueQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetFolderIconByValueQuery): Promise<FolderIcon> {
    const { icon } = query;

    return this.prismaService.folderIcon.findUnique({ where: { icon } });
  }
}
