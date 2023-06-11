export { CreateUserCommand } from './create-user';
export { GetUserCommand } from './get-user';
export { GetUserWithPositionCommand } from './get-user-with-position';
export { GetUserByEmailCommand } from './get-user-by-email';
export { PatchUserCommand } from './patch-user';
export { SaveAvatarCommand } from './save-avatar';
export { RemoveAvatarCommand } from './remove-avatar';

import { CreateUserHandler } from './create-user';
import { GetUserHandler } from './get-user';
import { GetUserWithPositionHandler } from './get-user-with-position';
import { GetUserByEmailHandler } from './get-user-by-email';
import { PatchUserHandler } from './patch-user';
import { SaveAvatarHandler } from './save-avatar';
import { RemoveAvatarHandler } from './remove-avatar';

export const UserHandlers = [
  CreateUserHandler,
  GetUserHandler,
  GetUserWithPositionHandler,
  GetUserByEmailHandler,
  PatchUserHandler,
  SaveAvatarHandler,
  RemoveAvatarHandler,
];
