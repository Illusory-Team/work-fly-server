import { RegisterUserOwnerDto } from 'auth/dto';

export class RegisterCommand {
  constructor(public readonly dto: RegisterUserOwnerDto) {}
}
