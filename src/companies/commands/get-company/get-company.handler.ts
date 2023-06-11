import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { CompanyDataDto } from 'companies/dto';
import { NOT_FOUND } from '@constants/error';
import { GetCompanyCommand } from './get-company.command';

@CommandHandler(GetCompanyCommand)
export class GetCompanyHandler implements ICommandHandler<GetCompanyCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: GetCompanyCommand): Promise<CompanyDataDto> {
    const { id } = command;

    const company = await this.prismaService.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException(NOT_FOUND);
    }

    return this.prismaService.company.findUnique({ where: { id } });
  }
}
