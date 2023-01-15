import { RefreshTokenGuard } from './../common/guards/refreshToken.guard';
import { HttpStatus } from '@nestjs/common/enums';
import { AuthService } from './auth.service';
import { Controller, Post, Get, Body, Req, Res, HttpCode, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserData } from './interfaces';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators';
import { REFRESH_TOKEN_TIME, ACCESS_TOKEN_TIME } from 'src/tokens/tokens.constants';
import { Tokens } from 'src/tokens/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('registration')
  async register(@Body() dto: RegisterUserDto, @Res() res: Response): Promise<Response<UserData>> {
    const userData = await this.authService.register(dto);

    this.setCookies(res, userData.tokens);

    return res.json(userData);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto, @Res() res: Response): Promise<Response<UserData>> {
    const userData = await this.authService.login(dto);

    this.setCookies(res, userData.tokens);

    return res.json(userData);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { refreshToken } = req.cookies;

    this.clearCookies(res);

    await this.authService.logout(refreshToken);

    return res.end();
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response): Promise<Response<UserData>> {
    const { refreshToken } = req.cookies;

    const userData = await this.authService.refresh(refreshToken);

    this.setCookies(res, userData.tokens);

    return res.json(userData);
  }

  private setCookies(res: Response, tokens: Tokens) {
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
