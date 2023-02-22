import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ColorsService {
  constructor(private prismaService: PrismaService) {}

  findByValue(color: string) {
    return this.prismaService.color.findUnique({where: {color}})
  }
}
