import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePositionCommand } from './create-position.command';
import { PositionDataDto } from 'positions/dto';
import { PrismaService } from 'prisma/prisma.service';

@CommandHandler(CreatePositionCommand)
export class CreatePositionCommandHandler implements ICommandHandler<CreatePositionCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: CreatePositionCommand): Promise<PositionDataDto> {
    const { companyId, value } = command;

    const position = await this.prismaService.position.create({ data: { companyId, value } });
    return new PositionDataDto(position);
  }
}
