export { CreateFolderCommand } from './create-folder';
export { GetFolderCommand } from './get-folder';
export { GetFolderByUserIdCommand } from './get-folder-by-user-id';
export { PatchFolderCommand } from './patch-folder';

import { CreateFolderHandler } from './create-folder';
import { GetFolderHandler } from './get-folder';
import { GetFolderByUserIdHandler } from './get-folder-by-user-id';
import { PatchFolderHandler } from './patch-folder';

export const FoldersHandlers = [CreateFolderHandler, GetFolderHandler, GetFolderByUserIdHandler, PatchFolderHandler];
