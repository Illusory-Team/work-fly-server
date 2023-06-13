import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { GetColorByValueQuery } from './get-color-by-value.query';
import { GetByValue } from 'colors/colors.interface';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND } from '@constants/error';

@QueryHandler(GetColorByValueQuery)
export class GetColorByValueQueryHandler implements IQueryHandler<GetColorByValueQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetColorByValueQuery): Promise<GetByValue> {
    const { color } = query;

    const foundColor = await this.prismaService.color.findUnique({ where: { color } });
    if (!foundColor) {
      throw new NotFoundException(NOT_FOUND);
    }

    return foundColor;
  }
}
