export { GetUserQuery } from './get-user';
export { GetUserByEmailQuery } from './get-user-by-email';
export { GetUserWithPositionQuery } from './get-user-with-position';

import { GetUserQueryHandler } from './get-user';
import { GetUserByEmailQueryHandler } from './get-user-by-email';
import { GetUserWithPositionQueryHandler } from './get-user-with-position';

export const UserQueryHandlers = [GetUserQueryHandler, GetUserByEmailQueryHandler, GetUserWithPositionQueryHandler];
