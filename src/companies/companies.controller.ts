import { CompaniesService } from './companies.service';
import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { CompanyDataDto, PatchCompanyDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NOTHING_PASSED, NOT_FOUND, UNAUTHORIZED } from '@constants/error';
import { VALIDATION } from '@constants/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: CompanyDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  findById(@Req() req: Request): Promise<CompanyDataDto> {
    return this.companiesService.findById(req.user['id']);
  }

  @Patch()
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: CompanyDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiBadRequestResponse({ schema: { anyOf: [{ description: VALIDATION }, { description: NOTHING_PASSED }] } })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  patchOne(@Req() req: Request, @Body() dto: PatchCompanyDto): Promise<CompanyDataDto> {
    const { accessToken } = req.cookies;
    return this.companiesService.patchOne(accessToken, req.user['id'], dto);
  }
}
