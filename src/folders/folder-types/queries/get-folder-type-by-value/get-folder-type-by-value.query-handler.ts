import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FolderType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND } from '@constants/error';
import { PrismaService } from 'prisma/prisma.service';
import { GetFolderTypeByValueQuery } from './get-folder-type-by-value.query';

@QueryHandler(GetFolderTypeByValueQuery)
export class GetFolderTypeByValueQueryHandler implements IQueryHandler<GetFolderTypeByValueQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetFolderTypeByValueQuery): Promise<FolderType> {
    const { type } = query;

    const folderType = await this.prismaService.folderType.findUnique({ where: { type } });
    if (!folderType) {
      throw new NotFoundException(NOT_FOUND);
    }

    return folderType;
  }
}
