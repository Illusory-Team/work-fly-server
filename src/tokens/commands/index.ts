export { ClearRefreshTokenCommand } from './clear-refresh-token';
export { GenerateTokensCommand } from './generate-tokens';

import { ClearRefreshTokenCommandHandler } from './clear-refresh-token';
import { GenerateTokensCommandHandler } from './generate-tokens';

export const TokenCommandHandlers = [ClearRefreshTokenCommandHandler, GenerateTokensCommandHandler];
