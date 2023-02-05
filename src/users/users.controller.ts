import { UsersService } from './users.service';
import { Controller, Get, Param, Patch, Body, Req } from '@nestjs/common';
import { PatchUserDto, PureUserDto } from './dto';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NOTHING_PASSED, NOT_FOUND, UNAUTHORIZED, USER_EXISTS, VALIDATION } from 'src/common/constants';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: PureUserDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  findById(@Param('id') id: string): Promise<PureUserDto> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: PureUserDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiBadRequestResponse({ schema: { anyOf: [{ description: VALIDATION }, { description: NOTHING_PASSED }] } })
  @ApiForbiddenResponse({ schema: {anyOf: [{description: USER_EXISTS}, {description: "You are not the owner of this account."}] }})
  @ApiNotFoundResponse({ description: NOT_FOUND })
  patchOne(@Req() req: Request, @Param('id') id: string, @Body() dto: PatchUserDto): Promise<PureUserDto> {
    const { accessToken } = req.cookies;
    return this.usersService.patchOne(accessToken, id, dto);
  }
}
