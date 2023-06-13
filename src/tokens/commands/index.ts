export { NullTokensCommand } from './null-tokens';
export { GenerateTokensCommand } from './generate-tokens';

import { NullTokensCommandHandler } from './null-tokens';
import { GenerateTokensCommandHandler } from './generate-tokens';

export const TokenCommandHandlers = [NullTokensCommandHandler, GenerateTokensCommandHandler];
