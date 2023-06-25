import { Request } from 'express';

export class GetCSRFTokenFromRequestQuery {
  constructor(public readonly req: Request) {}
}
