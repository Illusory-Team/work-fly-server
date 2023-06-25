export { CreateFolderCommand } from './create-folder';
export { PatchFolderCommand } from './patch-folder';

import { CreateFolderCommandHandler } from './create-folder';
import { PatchFolderCommandHandler } from './patch-folder';

export const FolderCommandHandlers = [CreateFolderCommandHandler, PatchFolderCommandHandler];
