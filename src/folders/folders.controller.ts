import { FoldersService } from './folders.service';
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateFolderDto, FolderDataDto, PatchFolderDto } from './dto';
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
import { UserRequest } from 'common/types/UserRequest';
import { OptionalValidationPipe } from 'common/pipes';

@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiCreatedResponse({ type: FolderDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  create(@Req() req: UserRequest, @Body() dto: CreateFolderDto): Promise<FolderDataDto> {
    return this.foldersService.create(req.user, dto);
  }

  @Get()
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: FolderDataDto, isArray: true })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  getByUserId(@Req() req: UserRequest): Promise<FolderDataDto[]> {
    return this.foldersService.getByUserId(req.user);
  }

  @Patch(':id')
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: FolderDataDto })
  @ApiBadRequestResponse({ description: NOTHING_PASSED })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiForbiddenResponse({ description: 'You are not the owner of this folder.' })
  patchOne(
    @Req() req: UserRequest,
    @Param('id') id: string,
    @Body(OptionalValidationPipe) dto: PatchFolderDto,
  ): Promise<FolderDataDto> {
    return this.foldersService.patchOne(req.user, id, dto);
  }
}
