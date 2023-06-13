export { SaveFileCommand } from './save-file';
export { RemoveFileCommand } from './remove-file';

import { SaveFileCommandHandler } from './save-file';
import { RemoveFileCommandHandler } from './remove-file';

export const FileCommandHandlers = [SaveFileCommandHandler, RemoveFileCommandHandler];
