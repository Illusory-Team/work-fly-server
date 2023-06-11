import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'prisma/prisma.service';
import { GetFolderIconByValueCommand } from './get-folder-icon-by-value.command';
import { FolderIcon } from '@prisma/client';

@CommandHandler(GetFolderIconByValueCommand)
export class GetFolderIconByValueHandler implements ICommandHandler<GetFolderIconByValueCommand> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: GetFolderIconByValueCommand): Promise<FolderIcon> {
    const { icon } = command;

    return this.prismaService.folderIcon.findUnique({ where: { icon } });
  }
}
