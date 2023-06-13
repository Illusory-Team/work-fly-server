import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { CompanyDataDto } from 'companies/dto';
import { NOT_FOUND } from '@constants/error';
import { GetCompanyQuery } from './get-company.query';

@QueryHandler(GetCompanyQuery)
export class GetCompanyQueryHandler implements IQueryHandler<GetCompanyQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetCompanyQuery): Promise<CompanyDataDto> {
    const { id } = query;

    const company = await this.prismaService.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException(NOT_FOUND);
    }

    return this.prismaService.company.findUnique({ where: { id } });
  }
}
