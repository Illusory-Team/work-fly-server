export { SetSessionCommand } from './set-session';
export { RegisterCommand } from './register';
export { LoginCommand } from './login';
export { LogoutCommand } from './logout';
export { RefreshCommand } from './refresh';

import { SetSessionCommandHandler } from './set-session';
import { RegisterCommandHandler } from './register';
import { LoginCommandHandler } from './login';
import { LogoutCommandHandler } from './logout';
import { RefreshCommandHandler } from './refresh';

export const AuthCommandHandlers = [
  SetSessionCommandHandler,
  RegisterCommandHandler,
  LoginCommandHandler,
  LogoutCommandHandler,
  RefreshCommandHandler,
];
