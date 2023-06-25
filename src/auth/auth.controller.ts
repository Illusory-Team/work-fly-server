import { TokensService } from 'tokens/tokens.service';
import { CreateUserDto } from 'users/dto';
import { HttpStatus } from '@nestjs/common/enums';
import { Controller, Post, Get, Patch, Body, Req, Res, HttpCode, UseGuards, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '@decorators';
import { REFRESH_TOKEN_TIME, ACCESS_TOKEN_TIME } from 'tokens/tokens.constants';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokensDto } from 'tokens/dto/tokens.dto';
import { AuthResponseDto, LoginUserDto, RegisterUserOwnerDto, UserSessionDto } from './dto';
import { CreateCompanyDto } from 'companies/dto';
import { EMAIL_PASSWORD_INCORRECT, NO_SESSION, UNAUTHORIZED, USER_EXISTS } from '@constants/error';
import { RefreshTokenGuard } from '@guards';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand, LogoutCommand, RefreshCommand, RegisterCommand, SetSessionCommand } from './commands';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus, private readonly tokensService: TokensService) {}

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
    type: AuthResponseDto,
  })
  @ApiForbiddenResponse({ description: USER_EXISTS })
  @ApiForbiddenResponse({ description: NO_SESSION })
  async register(
    @Session() session: Record<string, any>,
    @Body() dto: CreateCompanyDto,
    @Res() res: Response,
  ): Promise<Response<AuthResponseDto>> {
    const userRegData: CreateUserDto = session.userAuth;

    const userOwnerDto: RegisterUserOwnerDto = { company: dto, user: userRegData };

    const userData = await this.commandBus.execute(new RegisterCommand(userOwnerDto));

    this.setCookies(res, userData.tokens);

    return res.json(userData.data);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'The user has been successfully logined.', type: AuthResponseDto })
  @ApiForbiddenResponse({ description: EMAIL_PASSWORD_INCORRECT })
  async login(@Body() dto: LoginUserDto, @Res() res: Response): Promise<Response<AuthResponseDto>> {
    const userData = await this.commandBus.execute(new LoginCommand(dto));

    this.setCookies(res, userData.tokens);

    return res.json(userData.data);
  }

  @Patch('logout')
  @ApiSecurity('csrf')
  @ApiBearerAuth('refresh')
  @ApiOkResponse({ description: 'The user has been successfully logout.' })
  @ApiUnauthorizedResponse({ description: UNAUTHORIZED })
  async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { refreshToken } = req.cookies;
    const csrfToken = await this.tokensService.getCSRFTokenFromRequest(req);

    this.clearCookies(res);

    await this.commandBus.execute(new LogoutCommand(refreshToken, csrfToken));

    return res.end();
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth('refresh')
  @ApiOkResponse({ description: 'The tokens has been successfully refreshed.', type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized by refresh token.' })
  async refresh(@Req() req: Request, @Res() res: Response): Promise<Response<AuthResponseDto>> {
    const { refreshToken } = req.cookies;

    const userData = await this.commandBus.execute(new RefreshCommand(refreshToken));

    this.setCookies(res, userData.tokens);

    return res.json(userData.data);
  }

  private setCookies(res: Response, tokens: TokensDto) {
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: REFRESH_TOKEN_TIME,
      httpOnly: true,
    });
    res.cookie('accessToken', tokens.accessToken, {
      maxAge: ACCESS_TOKEN_TIME,
      httpOnly: true,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
  }
}
