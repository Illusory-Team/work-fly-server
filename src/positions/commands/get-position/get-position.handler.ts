import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { PositionDataDto } from 'positions/dto';
import { GetPositionCommand } from './get-position.command';

@CommandHandler(GetPositionCommand)
export class GetPositionHandler implements ICommandHandler<GetPositionCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: GetPositionCommand): Promise<PositionDataDto> {
    const { id } = command;

    const position = await this.prismaService.position.findUnique({ where: { id } });
    return new PositionDataDto(position);
  }
}
