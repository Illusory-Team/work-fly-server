import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NOT_FOUND } from '@constants/error';
import { PrismaService } from 'prisma/prisma.service';
import { PositionsService } from 'positions/positions.service';
import { FindUserDto, PureUserDto } from 'users/dto';
import { GetUserWithPositionCommand } from './get-user-with-position.command';

@CommandHandler(GetUserWithPositionCommand)
export class GetUserWithPositionHandler implements ICommandHandler<GetUserWithPositionCommand> {
  constructor(private readonly prismaService: PrismaService, private readonly positionsService: PositionsService) {}

  async execute(command: GetUserWithPositionCommand): Promise<FindUserDto> {
    const { id } = command;

    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    const position = await this.positionsService.getById(user.positionId);
    return { user: new PureUserDto(user), position };
  }
}
