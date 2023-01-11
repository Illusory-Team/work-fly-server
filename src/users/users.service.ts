import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({ data: dto });
  }

  async findOneById(id: number): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email } });
  }
}
