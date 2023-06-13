export { CreateUserCommand } from './create-user';
export { PatchUserCommand } from './patch-user';
export { SaveAvatarCommand } from './save-avatar';
export { RemoveAvatarCommand } from './remove-avatar';

import { CreateUserCommandHandler } from './create-user';
import { PatchUserCommandHandler } from './patch-user';
import { SaveAvatarCommandHandler } from './save-avatar';
import { RemoveAvatarCommandHandler } from './remove-avatar';

export const UserCommandHandlers = [
  CreateUserCommandHandler,
  PatchUserCommandHandler,
  SaveAvatarCommandHandler,
  RemoveAvatarCommandHandler,
];
