import { TokensService } from './../tokens/tokens.service';
import { CreateCompanyDto, PatchCompanyDto } from 'src/companies/dto';
import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Company } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prismaService: PrismaService, private tokensService: TokensService) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    return this.prismaService.company.create({ data: dto });
  }

  async findById(id: string): Promise<Company> {
    const company = await this.prismaService.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Nothing was found');
    }

    return this.prismaService.company.findUnique({ where: { id } });
  }

  async patchOne(refreshToken: string, id: string, dto: PatchCompanyDto): Promise<Company> {
    if (Object.keys(dto).length < 1) {
      throw new BadRequestException('Nothing was passed');
    }
    const { userId } = this.tokensService.validateRefreshToken(refreshToken);

    const company = await this.prismaService.company.findUnique({ where: { id } });

    if(!company) {
      throw new NotFoundException('Nothing was found');
    }

    //userId === company.ownerId logic to check permission to the company (in progress)

    return this.prismaService.company.update({ where: { id }, data: { ...dto } });
  }
}
