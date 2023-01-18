import { Decimal } from '@prisma/client/runtime';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class PureUserDto {
  @ApiProperty({ example: '1efe537f-e380-4168-959b-f864f2196369' })
  id: string;

  @ApiProperty({ example: 'user@gmail.com' })
  email: string;

  @ApiProperty({ description: 'full name of user', example: 'Vladislav Makarov' })
  fullName: string;

  @ApiProperty({ description: 'Work phone number', example: 89994377832, type: Number })
  phone: Decimal;

  @ApiProperty({ example: '2003-06-20 00:00:00' })
  birthday: Date;

  @ApiProperty({ description: 'Office address', example: 'Brandon St 82, London,' })
  address: string;

  @ApiProperty({ example: 'Working only from 11 a.m. to 7 p.m.' })
  description: string;

  constructor(model: User) {
    this.id = model.id;
    this.email = model.email;
    this.fullName = model.fullName;
    this.phone = model.phone;
    this.birthday = model.birthday;
    this.address = model.address;
    this.description = model.description;
  }
}
