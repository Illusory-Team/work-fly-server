import { CompaniesService } from './companies.service';
import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
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
import { UserRequest } from 'src/common/types/UserRequest';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get(':id')
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: CompanyDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  findById(@Param('id') id: string): Promise<CompanyDataDto> {
    return this.companiesService.findById(id);
  }

  @Patch(':id')
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: CompanyDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiBadRequestResponse({ schema: { anyOf: [{ description: VALIDATION }, { description: NOTHING_PASSED }] } })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  patchOne(@Req() req: UserRequest, @Param('id') id: string, @Body() dto: PatchCompanyDto): Promise<CompanyDataDto> {
    return this.companiesService.patchOne(req.user, id, dto);
  }
}
