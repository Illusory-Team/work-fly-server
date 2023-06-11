import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { GetColorByValueCommand } from './get-color-by-value.command';
import { GetByValue } from 'colors/colors.interface';

@CommandHandler(GetColorByValueCommand)
export class GetColorByValueHandler implements ICommandHandler<GetColorByValueCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: GetColorByValueCommand): Promise<GetByValue> {
    const { color } = command;

    return this.prismaService.color.findUnique({ where: { color } });
  }
}
