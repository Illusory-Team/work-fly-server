import { CompaniesService } from './companies.service';
import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { CompanyDataDto, PatchCompanyDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NOTHING_PASSED, NOT_FOUND, UNAUTHORIZED, VALIDATION } from 'src/common/constants';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get(':id')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: CompanyDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  findById(@Param('id') id: string): Promise<CompanyDataDto> {
    return this.companiesService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: CompanyDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiBadRequestResponse({ description: VALIDATION })
  @ApiNotFoundResponse({ schema: { anyOf: [{ description: NOT_FOUND }, { description: NOTHING_PASSED }] } })
  patchOne(@Req() req: Request, @Param('id') id: string, @Body() dto: PatchCompanyDto): Promise<CompanyDataDto> {
    const { accessToken } = req.cookies;
    return this.companiesService.patchOne(accessToken, id, dto);
  }
}
