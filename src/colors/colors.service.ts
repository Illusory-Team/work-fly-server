import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { FindByValue } from './interfaces';

@Injectable()
export class ColorsService {
  constructor(private prismaService: PrismaService) {}

  findByValue(color: string): Promise<FindByValue> {
    return this.prismaService.color.findUnique({ where: { color } });
  }
}
