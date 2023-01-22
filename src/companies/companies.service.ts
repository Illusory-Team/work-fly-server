import { CreateCompanyDto } from 'src/companies/dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompaniesService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateCompanyDto) {
    return this.prismaService.company.create({ data: dto });
  }
}
