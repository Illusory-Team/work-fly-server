import { FilesService } from 'files/files.service';
import { PositionsService } from 'positions/positions.service';
import { TokensService } from 'tokens/tokens.service';
import { PrismaService } from 'prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, FindUserDto, PatchUserDto, PureUserDto } from './dto';
import { NOTHING_PASSED, NOT_FOUND, USER_EXISTS } from '@constants/error';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private tokensService: TokensService,
    private positionsService: PositionsService,
    private filesService: FilesService,
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

  async patchOne(user: User, dto: PatchUserDto): Promise<PureUserDto> {
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

    const updatedUser = await this.prismaService.user.update({ where: { id: user.id }, data: { ...dto } });
    return new PureUserDto(updatedUser);
  }

  async saveAvatar(user: User, file: Express.Multer.File): Promise<PureUserDto> {
    const fileName = await this.filesService.saveAvatar(user.id, file, user.avatar);

    const updatedUser = await this.prismaService.user.update({ where: { id: user.id }, data: { avatar: fileName } });
    return new PureUserDto(updatedUser);
  }

  async removeAvatar(user: User): Promise<PureUserDto> {
    if (!user.avatar) {
      throw new NotFoundException(NOT_FOUND);
    }

    await this.filesService.removeAvatar(user.id, user.avatar);

    const updatedUser = await this.prismaService.user.update({ where: { id: user.id }, data: { avatar: null } });
    return new PureUserDto(updatedUser);
  }
}
