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
import { UserRequest } from 'common/types/UserRequest';
import { OptionalValidationPipe } from 'common/pipes';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCompanyQuery } from './queries';
import { PatchCompanyCommand } from './commands';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Get(':id')
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: CompanyDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  getById(@Param('id') id: string): Promise<CompanyDataDto> {
    return this.queryBus.execute(new GetCompanyQuery(id));
  }

  @Patch()
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: CompanyDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiBadRequestResponse({ schema: { anyOf: [{ description: VALIDATION }, { description: NOTHING_PASSED }] } })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  patchOne(@Req() req: UserRequest, @Body(OptionalValidationPipe) dto: PatchCompanyDto): Promise<CompanyDataDto> {
    return this.commandBus.execute(new PatchCompanyCommand(req.user, dto));
  }
}
