import { FoldersService } from './folders.service';
import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
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
  ApiSecurity,
} from '@nestjs/swagger';
import { NOTHING_PASSED, UNAUTHORIZED } from '@constants/error';

@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private foldersService: FoldersService) {}

  @Post()
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiCreatedResponse({ type: FolderDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  create(@Req() req: Request, @Body() dto: CreateFolderDto): Promise<FolderDataDto> {
    const { accessToken } = req.cookies;
    return this.foldersService.create(accessToken, dto);
  }

  @Get()
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: FolderDataDto, isArray: true })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  findByUserId(@Req() req: Request): Promise<FolderDataDto[]> {
    const { accessToken } = req.cookies;
    return this.foldersService.findByUserId(accessToken);
  }

  @Patch()
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: FolderDataDto })
  @ApiBadRequestResponse({ description: NOTHING_PASSED })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiForbiddenResponse({ description: 'You are not the owner of this folder.' })
  patchOne(@Req() req: Request, @Body() dto: PatchFolderDto): Promise<FolderDataDto> {
    const { accessToken } = req.cookies;
    return this.foldersService.patchOne(accessToken, req.user['id'], dto);
  }
}
