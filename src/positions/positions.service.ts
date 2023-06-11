import { CommandBus } from '@nestjs/cqrs';
import { PositionDataDto } from 'positions/dto';
import { Injectable } from '@nestjs/common';
import { CreatePositionCommand, GetPositionCommand } from './commands';

@Injectable()
export class PositionsService {
  constructor(private readonly commandBus: CommandBus) {}

  async create(companyId: string, value: string): Promise<PositionDataDto> {
    return this.commandBus.execute(new CreatePositionCommand(companyId, value));
  }

  async getById(id: string): Promise<PositionDataDto> {
    return this.commandBus.execute(new GetPositionCommand(id));
  }
}
