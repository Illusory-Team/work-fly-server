export { SaveFileCommand } from './save-file';
export { RemoveFileCommand } from './remove-file';

import { SaveFileHandler } from './save-file';
import { RemoveFileHandler } from './remove-file';

export const FileHandlers = [SaveFileHandler, RemoveFileHandler];
