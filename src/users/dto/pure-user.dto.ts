import { User } from '@prisma/client';

export class PureUserDto {
  id;
  email;
  fullName;
  phone;
  birthday;
  address;
  description;

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
