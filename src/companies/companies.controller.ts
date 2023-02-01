import { CompaniesService } from './companies.service';
import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { Company } from '@prisma/client';
import { Request } from 'express';
import { PatchCompanyDto } from './dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get(':id')
  findById(@Param('id') id: string): Promise<Company> {
    return this.companiesService.findById(id);
  }

  @Patch(':id')
  patchOne(@Req() req: Request, @Param('id') id: string, @Body() dto: PatchCompanyDto): Promise<Company> {
    const { refreshToken } = req.cookies;
    return this.companiesService.patchOne(refreshToken, id, dto);
  }
}
