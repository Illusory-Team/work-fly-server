import { CommandBus } from '@nestjs/cqrs';
import { CompanyDataDto, CreateCompanyDto } from 'companies/dto';
import { Injectable } from '@nestjs/common';
import { CreateCompanyCommand } from './commands';

@Injectable()
export class CompaniesService {
  constructor(private readonly commandBus: CommandBus) {}

  async create(dto: CreateCompanyDto): Promise<CompanyDataDto> {
    return this.commandBus.execute(new CreateCompanyCommand(dto));
  }
}
