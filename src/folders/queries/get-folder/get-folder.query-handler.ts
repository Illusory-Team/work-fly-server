import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NOT_FOUND } from '@constants/error';
import { PrismaService } from 'prisma/prisma.service';
import { FolderDataDto, UglyFolderDataDto } from 'folders/dto';
import { FoldersSelector } from 'folders/folders.selector';
import { FoldersMapper } from 'folders/folders.mapper';
import { GetFolderQuery } from './get-folder.query';

@QueryHandler(GetFolderQuery)
export class GetFolderQueryHandler implements IQueryHandler<GetFolderQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetFolderQuery): Promise<FolderDataDto> {
    const { id } = query;

    const folderData: UglyFolderDataDto = await this.prismaService.folder.findUnique({
      where: { id },
      select: FoldersSelector.selectFolder(),
    });

    if (!folderData) {
      throw new NotFoundException(NOT_FOUND);
    }

    return FoldersMapper.mapFolderResponse(folderData);
  }
}
