import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NOT_FOUND } from '@constants/error';
import { PrismaService } from 'prisma/prisma.service';
import { PositionsService } from 'positions/positions.service';
import { FindUserDto, PureUserDto } from 'users/dto';
import { GetUserWithPositionQuery } from './get-user-with-position.query';

@QueryHandler(GetUserWithPositionQuery)
export class GetUserWithPositionQueryHandler implements IQueryHandler<GetUserWithPositionQuery> {
  constructor(private readonly prismaService: PrismaService, private readonly positionsService: PositionsService) {}

  async execute(query: GetUserWithPositionQuery): Promise<FindUserDto> {
    const { id } = query;

    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    const position = await this.positionsService.getById(user.positionId);
    return { user: new PureUserDto(user), position };
  }
}
