import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FolderIconsService {
  constructor(private prismaService: PrismaService) {}

  findByValue(icon: string) {
    return this.prismaService.folderIcon.findUnique({where: {icon}})
  }
}
