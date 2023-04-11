import { NOTHING_PASSED, NOT_FOUND, UNAUTHORIZED } from '@constants/error';
import { FolderAppearanceDataDto } from './dto/folder-appearance-data.dto';
import { FolderAppearancesService } from './folder-appearances.service';
import { Body, Controller, Param, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
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

@ApiTags('folders/appearance')
@Controller('folders/appearance')
export class FolderAppearancesController {
  constructor(private folderAppearancesService: FolderAppearancesService) {}

  @Patch(':id')
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: FolderAppearanceDataDto })
  @ApiBadRequestResponse({ description: NOTHING_PASSED })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiForbiddenResponse({ description: 'You are not the owner of this folder.' })
  @ApiNotFoundResponse({
    schema: { anyOf: [{ description: NOT_FOUND }, { description: 'Incorrect icon/color name.' }] },
  })
  patchOneFolderAppearance(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: PatchFolderAppearanceDto,
  ): Promise<FolderAppearanceDataDto> {
    const { accessToken } = req.cookies;
    return this.folderAppearancesService.patchOne(accessToken, id, dto);
  }
}
