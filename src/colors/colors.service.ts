import { QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { GetByValue } from './colors.interface';
import { GetColorByValueQuery } from './queries';

@Injectable()
export class ColorsService {
  constructor(private readonly queryBus: QueryBus) {}

  getByValue(color: string): Promise<GetByValue> {
    return this.queryBus.execute(new GetColorByValueQuery(color));
  }
}
