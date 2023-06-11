import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { GetByValue } from './colors.interface';
import { GetColorByValueCommand } from './commands';

@Injectable()
export class ColorsService {
  constructor(private readonly commandBus: CommandBus) {}

  getByValue(color: string): Promise<GetByValue> {
    return this.commandBus.execute(new GetColorByValueCommand(color));
  }
}
