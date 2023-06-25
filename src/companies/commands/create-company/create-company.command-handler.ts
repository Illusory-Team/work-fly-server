import { CommandHandler } from '@nestjs/cqrs';
import { CreateCompanyCommand } from './create-company.command';
import { PrismaService } from 'prisma/prisma.service';
import { CompanyDataDto } from 'companies/dto';

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyCommandHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: CreateCompanyCommand): Promise<CompanyDataDto> {
    const { dto } = command;

    return this.prismaService.company.create({ data: dto });
  }
}
