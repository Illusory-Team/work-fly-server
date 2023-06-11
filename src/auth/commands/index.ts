export { SetSessionCommand } from './set-session';
export { RegisterCommand } from './register';
export { LoginCommand } from './login';
export { LogoutCommand } from './logout';
export { RefreshCommand } from './refresh';

import { SetSessionHandler } from './set-session';
import { RegisterHandler } from './register';
import { LoginHandler } from './login';
import { LogoutHandler } from './logout';
import { RefreshHandler } from './refresh';

export const AuthHandlers = [SetSessionHandler, RegisterHandler, LoginHandler, LogoutHandler, RefreshHandler];
