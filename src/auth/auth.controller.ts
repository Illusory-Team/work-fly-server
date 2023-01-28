import { CreateUserDto } from 'src/users/dto';
import { RefreshTokenGuard } from './../common/guards/refreshToken.guard';
import { HttpStatus } from '@nestjs/common/enums';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Req,
  Res,
  HttpCode,
  UseGuards,
  Session,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators';
import { REFRESH_TOKEN_TIME, ACCESS_TOKEN_TIME } from 'src/tokens/tokens.constants';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokensDto } from 'src/tokens/dto/tokens.dto';
import { LoginUserDto, RegisterUserOwnerDto, UserDataDto, UserSessionDto } from './dto';
import { CreateCompanyDto } from 'src/companies/dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('session')
  @ApiCreatedResponse({ description: 'User data session will have been available for 15 mins.' })
  @ApiForbiddenResponse({ description: 'User already exists.' })
  async setSession(@Session() session: Record<string, any>, @Body() dto: UserSessionDto) {
    const userSessionData = await this.authService.setSession(dto);
    session.userAuth = { ...userSessionData };
  }

  @Public()
  @Post('registration')
  @ApiCreatedResponse({ description: 'The user and the company have been successfully created.', type: UserDataDto })
  @ApiForbiddenResponse({ description: 'User already exists.' })
  @ApiForbiddenResponse({ description: 'You don not have user data in the session, register user again.' })
  async register(
    @Session() session: Record<string, any>,
    @Body() dto: CreateCompanyDto,
    @Res() res: Response,
  ): Promise<Response<UserDataDto>> {
    const userRegData: CreateUserDto = session.userAuth;

    const userOwnerDto: RegisterUserOwnerDto = { company: dto, user: userRegData };

    const userData = await this.authService.register(userOwnerDto);

    this.setCookies(res, userData.tokens);

    return res.json(userData);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'The user has been successfully logined.', type: UserDataDto })
  @ApiForbiddenResponse({ description: 'Email or password is incorrect.' })
  async login(@Body() dto: LoginUserDto, @Res() res: Response): Promise<Response<UserDataDto>> {
    const userData = await this.authService.login(dto);

    this.setCookies(res, userData.tokens);

    return res.json(userData);
  }

  @Patch('logout')
  @ApiBearerAuth('access')
  @ApiOkResponse({ description: 'The user has been successfully logout.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { refreshToken } = req.cookies;

    this.clearCookies(res);

    await this.authService.logout(refreshToken);

    return res.end();
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth('refresh')
  @ApiOkResponse({ description: 'The tokens has been successfully refreshed.', type: UserDataDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized by refresh token.' })
  async refresh(@Req() req: Request, @Res() res: Response): Promise<Response<UserDataDto>> {
    const { refreshToken } = req.cookies;

    const userData = await this.authService.refresh(refreshToken);

    this.setCookies(res, userData.tokens);

    return res.json(userData);
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
