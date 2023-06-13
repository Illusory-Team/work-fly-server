import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FolderDataDto, UglyFolderDataDto } from 'folders/dto';
import { PrismaService } from 'prisma/prisma.service';
import { FoldersSelector } from 'folders/folders.selector';
import { FoldersMapper } from 'folders/folders.mapper';
import { GetFolderByUserIdQuery } from './get-folder-by-user-id.query';

@QueryHandler(GetFolderByUserIdQuery)
export class GetFolderByUserIdQueryHandler implements IQueryHandler<GetFolderByUserIdQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetFolderByUserIdQuery): Promise<FolderDataDto[]> {
    const { user } = query;

    const foldersData: UglyFolderDataDto[] = await this.prismaService.folder.findMany({
      where: { ownerId: user.id },
      select: FoldersSelector.selectFolder(),
    });

    return foldersData.map((folder) => FoldersMapper.mapFolderResponse(folder));
  }
}
