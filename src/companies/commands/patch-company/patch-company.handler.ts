import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PatchCompanyCommand } from './patch-company.command';
import { CompanyDataDto } from 'companies/dto';
import { PrismaService } from 'prisma/prisma.service';
import { NOTHING_PASSED, NOT_FOUND } from '@constants/error';

@CommandHandler(PatchCompanyCommand)
export class PatchCompanyHandler implements ICommandHandler<PatchCompanyCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: PatchCompanyCommand): Promise<CompanyDataDto> {
    const { user, dto } = command;

    if (Object.keys(dto).length < 1) {
      throw new BadRequestException(NOTHING_PASSED);
    }

    const company = await this.prismaService.company.findUnique({ where: { id: user.companyId } });

    if (!company) {
      throw new NotFoundException(NOT_FOUND);
    }

    //userId === company.ownerId logic to check permission to the company (in progress)

    return this.prismaService.company.update({ where: { id: user.companyId }, data: { ...dto } });
  }
}
