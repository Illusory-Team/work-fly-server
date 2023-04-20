import { TokensService } from './../tokens/tokens.service';
import { CompanyDataDto, CreateCompanyDto, PatchCompanyDto } from 'src/companies/dto';
import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NOTHING_PASSED, NOT_FOUND } from '@constants/error';

@Injectable()
export class CompaniesService {
  constructor(private prismaService: PrismaService, private tokensService: TokensService) {}

  async create(dto: CreateCompanyDto): Promise<CompanyDataDto> {
    return this.prismaService.company.create({ data: dto });
  }

  async findById(id: string): Promise<CompanyDataDto> {
    const company = await this.prismaService.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException(NOT_FOUND);
    }

    return this.prismaService.company.findUnique({ where: { id } });
  }

  async patchOne(accessToken: string, id: string, dto: PatchCompanyDto): Promise<CompanyDataDto> {
    if (Object.keys(dto).length < 1) {
      throw new BadRequestException(NOTHING_PASSED);
    }
    const { userId } = this.tokensService.validateAccessToken(accessToken);

    const company = await this.prismaService.company.findUnique({ where: { id } });

    if (!company) {
      throw new NotFoundException(NOT_FOUND);
    }

    //userId === company.ownerId logic to check permission to the company (in progress)

    return this.prismaService.company.update({ where: { id }, data: { ...dto } });
  }
}
