import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND } from '@constants/error';
import { PrismaService } from 'prisma/prisma.service';
import { GetUserQuery } from './get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUserQuery): Promise<User> {
    const { id } = query;

    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    return user;
  }
}
