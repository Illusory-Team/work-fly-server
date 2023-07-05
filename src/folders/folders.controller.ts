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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFolderCommand, PatchFolderCommand } from './commands';
import { GetFolderByUserIdQuery } from './queries';

@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  @ApiSecurity('access')
  @ApiBearerAuth('access')
  @ApiCreatedResponse({ type: FolderDataDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  create(@Req() req: UserRequest, @Body() dto: CreateFolderDto): Promise<FolderDataDto> {
    return this.commandBus.execute(new CreateFolderCommand(req.user, dto));
  }

  @Get()
  @ApiSecurity('access')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: FolderDataDto, isArray: true })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  getByUserId(@Req() req: UserRequest): Promise<FolderDataDto[]> {
    return this.queryBus.execute(new GetFolderByUserIdQuery(req.user));
  }

  @Patch(':id')
  @ApiSecurity('access')
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
    return this.commandBus.execute(new PatchFolderCommand(req.user, id, dto));
  }
}
