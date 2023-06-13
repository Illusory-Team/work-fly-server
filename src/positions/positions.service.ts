import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PositionDataDto } from 'positions/dto';
import { Injectable } from '@nestjs/common';
import { CreatePositionCommand } from './commands';
import { GetPositionQuery } from './queries';

@Injectable()
export class PositionsService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async create(companyId: string, value: string): Promise<PositionDataDto> {
    return this.commandBus.execute(new CreatePositionCommand(companyId, value));
  }

  async getById(id: string): Promise<PositionDataDto> {
    return this.queryBus.execute(new GetPositionQuery(id));
  }
}
