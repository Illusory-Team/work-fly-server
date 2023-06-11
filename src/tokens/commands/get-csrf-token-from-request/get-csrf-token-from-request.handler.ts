import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetCSRFTokenFromRequestCommand } from './get-csrf-token-from-request.command';

@CommandHandler(GetCSRFTokenFromRequestCommand)
export class GetCSRFTokenFromRequestHandler implements ICommandHandler<GetCSRFTokenFromRequestCommand> {
  async execute(command: GetCSRFTokenFromRequestCommand): Promise<string> {
    const { req } = command;

    return (req.headers['csrf-token'] ||
      req.headers['xsrf-token'] ||
      req.headers['x-csrf-token'] ||
      req.headers['x-xsrf-token']) as string;
  }
}
