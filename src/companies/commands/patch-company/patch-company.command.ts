import { User } from '@prisma/client';
import { PatchCompanyDto } from 'companies/dto';

export class PatchCompanyCommand {
  constructor(public readonly user: User, public readonly dto: PatchCompanyDto) {}
}
