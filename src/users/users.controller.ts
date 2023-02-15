import { UsersService } from './users.service';
import {
  Controller,
  Get,
  Param,
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  IMAGE_VALIDATION,
  NOTHING_PASSED,
  NOT_FOUND,
  ONE_MB,
  UNAUTHORIZED,
  USER_EXISTS,
  VALIDATION,
} from 'src/common/constants';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('avatar')
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
  ) {
    const { accessToken } = req.cookies;
    return this.usersService.saveAvatar(accessToken, file);
  }

  @Patch('avatar')
  @ApiBearerAuth('access')
  @ApiOkResponse({ description: 'Removes avatar file.', type: PureUserDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  removeAvatar(@Req() req: Request) {
    const { accessToken } = req.cookies;
    return this.usersService.removeAvatar(accessToken);
  }

  @Get(':id')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: PureUserDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  findById(@Param('id') id: string): Promise<FindUserDto> {
    return this.usersService.findWithPosition(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access')
  @ApiOkResponse({ type: PureUserDto })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  @ApiBadRequestResponse({ schema: { anyOf: [{ description: VALIDATION }, { description: NOTHING_PASSED }] } })
  @ApiForbiddenResponse({
    schema: { anyOf: [{ description: USER_EXISTS }, { description: 'You are not the owner of this account.' }] },
  })
  @ApiNotFoundResponse({ description: NOT_FOUND })
  patchOne(@Req() req: Request, @Param('id') id: string, @Body() dto: PatchUserDto): Promise<PureUserDto> {
    const { accessToken } = req.cookies;
    return this.usersService.patchOne(accessToken, id, dto);
  }
}
