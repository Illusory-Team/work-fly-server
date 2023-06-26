import { NOTHING_PASSED, NOT_FOUND, UNAUTHORIZED } from '@constants/error';
import { MappedFolderAppearanceDataDto } from './dto';
import { Body, Controller, Param, Patch, Req } from '@nestjs/common';
import { PatchFolderAppearanceDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserRequest } from 'common/types/UserRequest';
import { OptionalValidationPipe } from 'common/pipes';
import { CommandBus } from '@nestjs/cqrs';
import { PatchFolderAppearanceCommand } from './commands';

@ApiTags('folders/appearance')
@Controller('folders/appearance')
export class FolderAppearancesController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @ApiSecurity('access')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: MappedFolderAppearanceDataDto })
  @ApiBadRequestResponse({ description: NOTHING_PASSED })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiForbiddenResponse({ description: 'You are not the owner of this folder.' })
  @ApiNotFoundResponse({
    schema: { anyOf: [{ description: NOT_FOUND }, { description: 'Incorrect icon/color name.' }] },
  })
  patchOneFolderAppearance(
    @Req() req: UserRequest,
    @Param('id') id: string,
    @Body(OptionalValidationPipe) dto: PatchFolderAppearanceDto,
  ): Promise<MappedFolderAppearanceDataDto> {
    return this.commandBus.execute(new PatchFolderAppearanceCommand(req.user, id, dto));
  }
}
