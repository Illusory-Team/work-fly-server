import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NOTHING_PASSED, USER_EXISTS } from '@constants/error';
import { PrismaService } from 'prisma/prisma.service';
import { PureUserDto } from 'users/dto';
import { PatchUserCommand } from './patch-user.command';

@CommandHandler(PatchUserCommand)
export class PatchUserHandler implements ICommandHandler<PatchUserCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: PatchUserCommand): Promise<PureUserDto> {
    const { user, dto } = command;

    if (Object.keys(dto).length < 1) {
      throw new BadRequestException(NOTHING_PASSED);
    }
    if (dto.email) {
      const candidate = await this.prismaService.user.findUnique({ where: { email: dto.email } });
      if (candidate) throw new ForbiddenException(USER_EXISTS);
    }
    if (dto.birthday) {
      dto.birthday = new Date(dto.birthday);
    }

    const updatedUser = await this.prismaService.user.update({ where: { id: user.id }, data: { ...dto } });
    return new PureUserDto(updatedUser);
  }
}
