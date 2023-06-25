import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCSRFTokenFromRequestQuery } from './get-csrf-token-from-request.query';

@QueryHandler(GetCSRFTokenFromRequestQuery)
export class GetCSRFTokenFromRequestQueryHandler implements IQueryHandler<GetCSRFTokenFromRequestQuery> {
  async execute(query: GetCSRFTokenFromRequestQuery): Promise<string> {
    const { req } = query;

    return (req.headers['csrf-token'] ||
      req.headers['xsrf-token'] ||
      req.headers['x-csrf-token'] ||
      req.headers['x-xsrf-token']) as string;
  }
}
