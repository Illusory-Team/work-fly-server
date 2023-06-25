import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { PositionDataDto } from 'positions/dto';
import { GetPositionQuery } from './get-position.query';

@QueryHandler(GetPositionQuery)
export class GetPositionQueryHandler implements IQueryHandler<GetPositionQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetPositionQuery): Promise<PositionDataDto> {
    const { id } = query;

    const position = await this.prismaService.position.findUnique({ where: { id } });
    return new PositionDataDto(position);
  }
}
