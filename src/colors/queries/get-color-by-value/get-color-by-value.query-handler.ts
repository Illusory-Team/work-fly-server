import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { GetColorByValueQuery } from './get-color-by-value.query';
import { GetByValue } from 'colors/colors.interface';

@QueryHandler(GetColorByValueQuery)
export class GetColorByValueQueryHandler implements IQueryHandler<GetColorByValueQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetColorByValueQuery): Promise<GetByValue> {
    const { color } = query;

    return this.prismaService.color.findUnique({ where: { color } });
  }
}
