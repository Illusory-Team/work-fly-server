import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { GetFolderIconByValueQuery } from './get-folder-icon-by-value.command';
import { FolderIcon } from '@prisma/client';
import { NOT_FOUND } from '@constants/error';

@QueryHandler(GetFolderIconByValueQuery)
export class GetFolderIconByValueQueryHandler implements IQueryHandler<GetFolderIconByValueQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetFolderIconByValueQuery): Promise<FolderIcon> {
    const { icon } = query;

    const foundIcon = await this.prismaService.folderIcon.findUnique({ where: { icon } });
    if (!foundIcon) {
      throw new NotFoundException(NOT_FOUND);
    }

    return foundIcon;
  }
}
