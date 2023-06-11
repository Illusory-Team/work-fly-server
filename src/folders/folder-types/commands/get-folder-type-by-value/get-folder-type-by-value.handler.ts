import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetFolderTypeByValueCommand } from './get-folder-type-by-value.command';
import { FolderType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND } from '@constants/error';
import { PrismaService } from 'prisma/prisma.service';

@CommandHandler(GetFolderTypeByValueCommand)
export class GetFolderTypeByValueHandler implements ICommandHandler<GetFolderTypeByValueCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: GetFolderTypeByValueCommand): Promise<FolderType> {
    const { type } = command;

    const folderType = await this.prismaService.folderType.findUnique({ where: { type } });
    if (!folderType) {
      throw new NotFoundException(NOT_FOUND);
    }

    return folderType;
  }
}
