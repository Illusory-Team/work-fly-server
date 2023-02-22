import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NOT_FOUND } from 'src/common/constants';

@Injectable()
export class FolderTypesService {
  constructor(private prismaService: PrismaService) {}

  async findByValue(type: string) {
    const folderType = await this.prismaService.folderType.findUnique({where: {type}})
    if (!folderType) {
      throw new NotFoundException(NOT_FOUND);
    }

    return folderType
  }
}
