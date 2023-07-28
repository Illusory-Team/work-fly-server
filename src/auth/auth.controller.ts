import { CreateUserDto } from 'users/dto';
import { HttpStatus } from '@nestjs/common/enums';
import { Controller, Post, Get, Patch, Body, Req, Res, HttpCode, UseGuards, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '@decorators';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto, RefreshReturnDto, RegisterUserOwnerDto, UserDataDto, UserSessionDto } from './dto';
import { CreateCompanyDto } from 'companies/dto';
import { EMAIL_PASSWORD_INCORRECT, NO_SESSION, UNAUTHORIZED, USER_EXISTS } from '@constants/error';
import { RefreshTokenGuard } from '@guards';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand, LogoutCommand, RefreshCommand, RegisterCommand, SetSessionCommand } from './commands';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus, private readonly configService: ConfigService) {}

  @Public()
  @Post('session')
  @ApiCreatedResponse({ description: 'User data session will have been available for 15 mins.' })
  @ApiForbiddenResponse({ description: USER_EXISTS })
  async setSession(@Session() session: Record<string, any>, @Body() dto: UserSessionDto): Promise<void> {
    const userSessionData = await this.commandBus.execute(new SetSessionCommand(dto));
    session.userAuth = { ...userSessionData };
  }

  @Public()
  @Post('registration')
  @ApiCreatedResponse({
    description: 'The user and the company have been successfully created.',
    type: UserDataDto,
  })
  @ApiForbiddenResponse({ description: USER_EXISTS })
  @ApiForbiddenResponse({ description: NO_SESSION })
  async register(
    @Session() session: Record<string, any>,
    @Body() dto: CreateCompanyDto,
    @Res() res: Response,
  ): Promise<Response<UserDataDto>> {
    const userRegData: CreateUserDto = session.userAuth;

    const userOwnerDto: RegisterUserOwnerDto = { company: dto, user: { ...userRegData, password: '' } };

    const userData = await this.commandBus.execute(new RegisterCommand(userOwnerDto));

    this.setCookie(res, userData.refreshToken);

    return res.json(userData.data);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'The user has been successfully logged in.', type: UserDataDto })
  @ApiForbiddenResponse({ description: EMAIL_PASSWORD_INCORRECT })
  async login(@Body() dto: LoginUserDto, @Res() res: Response): Promise<Response<UserDataDto>> {
    const userData = await this.commandBus.execute(new LoginCommand(dto));

    this.setCookie(res, userData.refreshToken);

    return res.json(userData.data);
  }

  @Patch('logout')
  @ApiSecurity('access')
  @ApiBearerAuth('refresh')
  @ApiOkResponse({ description: 'The user has been successfully logout.' })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { refreshToken } = req.cookies;

    this.clearCookie(res);

    await this.commandBus.execute(new LogoutCommand(refreshToken));

    return res.end();
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth('refresh')
  @ApiOkResponse({ description: 'The tokens has been successfully refreshed.', type: RefreshReturnDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized by refresh token.' })
  async refresh(@Req() req: Request, @Res() res: Response): Promise<Response<RefreshReturnDto>> {
    const { refreshToken } = req.cookies;

    const tokens = await this.commandBus.execute(new RefreshCommand(refreshToken));

    this.setCookie(res, tokens.refreshToken);

    return res.json({ accessToken: tokens.accessToken });
  }

  private setCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: +this.configService.get<string>('REFRESH_TIME_MS'),
      httpOnly: true,
    });
  }

  private clearCookie(res: Response) {
    res.clearCookie('refreshToken');
  }
}
