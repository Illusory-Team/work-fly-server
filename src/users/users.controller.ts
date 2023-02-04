import { UsersService } from './users.service';
import { Controller, Get, Param, Patch, Body, Req } from '@nestjs/common';
import { PatchUserDto, PureUserDto } from './dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  findById(@Param('id') id: string): Promise<PureUserDto> {
    return this.usersService.findById(id)
  }

  @Patch(':id')
  patchOne(@Req() req: Request, @Param('id') id: string, @Body() dto: PatchUserDto): Promise<PureUserDto> {
    const { accessToken } = req.cookies;
    return this.usersService.patchOne(accessToken, id, dto)
  }
}
