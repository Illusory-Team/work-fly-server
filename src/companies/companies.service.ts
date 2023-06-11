import { CommandBus } from '@nestjs/cqrs';
import { CompanyDataDto, CreateCompanyDto, PatchCompanyDto } from 'companies/dto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateCompanyCommand, GetCompanyCommand, PatchCompanyCommand } from './commands';

@Injectable()
export class CompaniesService {
  constructor(private readonly commandBus: CommandBus) {}

  async create(dto: CreateCompanyDto): Promise<CompanyDataDto> {
    return this.commandBus.execute(new CreateCompanyCommand(dto));
  }

  async getById(id: string): Promise<CompanyDataDto> {
    return this.commandBus.execute(new GetCompanyCommand(id));
  }

  async patchOne(user: User, dto: PatchCompanyDto): Promise<CompanyDataDto> {
    return this.commandBus.execute(new PatchCompanyCommand(user, dto));
  }
}
