import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CompanyDataDto, CreateCompanyDto, PatchCompanyDto } from 'companies/dto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateCompanyCommand, PatchCompanyCommand } from './commands';
import { GetCompanyQuery } from './queries';

@Injectable()
export class CompaniesService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async create(dto: CreateCompanyDto): Promise<CompanyDataDto> {
    return this.commandBus.execute(new CreateCompanyCommand(dto));
  }

  async getById(id: string): Promise<CompanyDataDto> {
    return this.queryBus.execute(new GetCompanyQuery(id));
  }

  async patchOne(user: User, dto: PatchCompanyDto): Promise<CompanyDataDto> {
    return this.commandBus.execute(new PatchCompanyCommand(user, dto));
  }
}
