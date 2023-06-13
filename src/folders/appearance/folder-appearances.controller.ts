import { NOTHING_PASSED, NOT_FOUND, UNAUTHORIZED } from '@constants/error';
import { MappedFolderAppearanceDataDto } from './dto';
import { FolderAppearancesService } from './folder-appearances.service';
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

@ApiTags('folders/appearance')
@Controller('folders/appearance')
export class FolderAppearancesController {
  constructor(private readonly folderAppearancesService: FolderAppearancesService) {}

  @Patch(':id')
  @ApiSecurity('csrf')
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
    return this.folderAppearancesService.patchOne(req.user, id, dto);
  }
}
