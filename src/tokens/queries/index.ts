export { ValidateAccessTokenQuery } from './validate-access-token';

import { ValidateAccessTokenQueryHandler } from './validate-access-token';
import { ValidateRefreshTokenQueryHandler } from './validate-refresh-token';

export const TokenQueryHandlers = [ValidateAccessTokenQueryHandler, ValidateRefreshTokenQueryHandler];
