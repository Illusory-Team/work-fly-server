import { PositionDataDto } from 'positions/dto';
import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PositionsService {
  constructor(private prismaService: PrismaService) {}

  async create(companyId: string, value: string): Promise<PositionDataDto> {
    const position = await this.prismaService.position.create({ data: { companyId, value } });
    return new PositionDataDto(position);
  }

  async findById(id: string): Promise<PositionDataDto> {
    const position = await this.prismaService.position.findUnique({ where: { id } });
    return new PositionDataDto(position);
  }
}
