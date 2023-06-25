export { GetCSRFTokenFromRequestQuery } from './get-csrf-token-from-request';
export { ValidateAccessTokenQuery } from './validate-access-token';
export { ValidateCSRFTokenQuery } from './validate-csrf-token';

import { GetCSRFTokenFromRequestQueryHandler } from './get-csrf-token-from-request';
import { ValidateAccessTokenQueryHandler } from './validate-access-token';
import { ValidateCSRFTokenQueryHandler } from './validate-csrf-token';
import { ValidateRefreshTokenQueryHandler } from './validate-refresh-token';

export const TokenQueryHandlers = [
  GetCSRFTokenFromRequestQueryHandler,
  ValidateAccessTokenQueryHandler,
  ValidateCSRFTokenQueryHandler,
  ValidateRefreshTokenQueryHandler,
];
