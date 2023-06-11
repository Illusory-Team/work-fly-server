import { CreateCompanyDto } from 'companies/dto';

export class CreateCompanyCommand {
  constructor(public readonly dto: CreateCompanyDto) {}
}
