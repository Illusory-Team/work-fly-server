import { Request } from 'express';

export class GetCSRFTokenFromRequestCommand {
  constructor(public readonly req: Request) {}
}
