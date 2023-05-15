import { UsersService } from './users.service';
import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FindUserDto, PatchUserDto, PureUserDto } from './dto';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ONE_MB } from '@constants/index';
import { NOTHING_PASSED, NOT_FOUND, UNAUTHORIZED, USER_EXISTS } from '@constants/error';
import { IMAGE_VALIDATION, VALIDATION } from '@constants/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('avatar')
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Saves avatar file.', type: PureUserDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiBadRequestResponse({ schema: { anyOf: [{ description: IMAGE_VALIDATION }, { description: NOTHING_PASSED }] } })
  @UseInterceptors(FileInterceptor('file'))
  saveAvatar(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: ONE_MB }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<PureUserDto> {
    return this.usersService.saveAvatar(req.user as User, file);
  }

  @Patch('avatar')
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ description: 'Removes avatar file.', type: PureUserDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  removeAvatar(@Req() req: Request): Promise<PureUserDto> {
    return this.usersService.removeAvatar(req.user as User);
  }

  @Get('me')
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: PureUserDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  findById(@Req() req: Request): Promise<FindUserDto> {
    return this.usersService.findWithPosition(req.user['id']);
  }

  @Patch('me')
  @ApiSecurity('csrf')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: PureUserDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiBadRequestResponse({ schema: { anyOf: [{ description: VALIDATION }, { description: NOTHING_PASSED }] } })
  @ApiForbiddenResponse({
    schema: { anyOf: [{ description: USER_EXISTS }, { description: 'You are not the owner of this account.' }] },
  })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  patchOne(@Req() req: Request, @Body() dto: PatchUserDto): Promise<PureUserDto> {
    return this.usersService.patchOne(req.user as User, dto);
  }
}
