import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { GetUserByEmailQuery } from './get-user-by-email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUserByEmailQuery): Promise<User> {
    const { email } = query;

    return this.prismaService.user.findUnique({ where: { email } });
  }
}
