import { UserSessionDto } from 'auth/dto';

export class SetSessionCommand {
  constructor(public readonly dto: UserSessionDto) {}
}
