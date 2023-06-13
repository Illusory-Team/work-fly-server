export { ClearTokensCommand } from './clear-tokens';
export { GenerateTokensCommand } from './generate-tokens';

import { ClearTokensCommandHandler } from './clear-tokens';
import { GenerateTokensCommandHandler } from './generate-tokens';

export const TokenCommandHandlers = [ClearTokensCommandHandler, GenerateTokensCommandHandler];
