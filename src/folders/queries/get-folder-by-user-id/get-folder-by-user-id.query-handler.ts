import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FolderDataDto, MappedFolderDataDto } from 'folders/dto';
import { PrismaService } from 'prisma/prisma.service';
import { FoldersSelector } from 'folders/folders.selector';
import { FoldersMapper } from 'folders/folders.mapper';
import { GetFolderByUserIdQuery } from './get-folder-by-user-id.query';

@QueryHandler(GetFolderByUserIdQuery)
export class GetFolderByUserIdQueryHandler implements IQueryHandler<GetFolderByUserIdQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetFolderByUserIdQuery): Promise<MappedFolderDataDto[]> {
    const { user } = query;

    const foldersData: FolderDataDto[] = await this.prismaService.folder.findMany({
      where: { ownerId: user.id },
      select: FoldersSelector.selectFolder(),
    });

    return foldersData.map((folder) => FoldersMapper.mapFolderResponse(folder));
  }
}
