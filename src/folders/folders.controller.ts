import { FoldersService } from './folders.service';
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateFolderDto, FolderDataDto, PatchFolderDto } from './dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { NOTHING_PASSED, UNAUTHORIZED } from 'src/common/constants';

@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private foldersService: FoldersService) {}

  @Post()
  @ApiBearerAuth('access')
  @ApiCreatedResponse({ type: FolderDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  create(@Req() req: Request, @Body() dto: CreateFolderDto): Promise<FolderDataDto> {
    const { accessToken } = req.cookies;
    return this.foldersService.create(accessToken, dto);
  }

  @Get()
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: FolderDataDto, isArray: true })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  findByUserId(@Req() req: Request): Promise<FolderDataDto[]> {
    const { accessToken } = req.cookies;
    return this.foldersService.findByUserId(accessToken);
  }

  @Patch(':id')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: FolderDataDto })
  @ApiBadRequestResponse({ description: NOTHING_PASSED })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiForbiddenResponse({ description: 'You are not the owner of this folder.' })
  patchOne(@Req() req: Request, @Param('id') id: string, @Body() dto: PatchFolderDto): Promise<FolderDataDto> {
    const { accessToken } = req.cookies;
    return this.foldersService.patchOne(accessToken, id, dto);
  }
}
