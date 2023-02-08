import { PositionsService } from './../positions/positions.service';
import { TokensService } from './../tokens/tokens.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, FindUserDto, PatchUserDto, PureUserDto } from './dto';
import { NOTHING_PASSED, NOT_FOUND, USER_EXISTS } from 'src/common/constants';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private tokensService: TokensService,
    private positionsService: PositionsService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({ data: dto });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    return user;
  }

  async findWithPosition(id: string): Promise<FindUserDto> {
    const user = await this.findById(id);
    const position = await this.positionsService.findById(user.positionId);
    return { user: new PureUserDto(user), position };
  }

  async findByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async patchOne(accessToken: string, id: string, dto: PatchUserDto): Promise<PureUserDto> {
    if (Object.keys(dto).length < 1) {
      throw new BadRequestException(NOTHING_PASSED);
    }
    if (dto.email) {
      const candidate = await this.findByEmail(dto.email);
      if (candidate) throw new ForbiddenException(USER_EXISTS);
    }
    if (dto.birthday) {
      dto.birthday = new Date(dto.birthday);
    }

    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    const { userId } = this.tokensService.validateAccessToken(accessToken);
    if (user.id !== userId) {
      throw new ForbiddenException();
    }

    const updatedUser = await this.prismaService.user.update({ where: { id }, data: { ...dto } });
    return new PureUserDto(updatedUser);
  }
}
