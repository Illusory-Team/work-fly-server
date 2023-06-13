export { GetFolderQuery } from './get-folder';
export { GetFolderByUserIdQuery } from './get-folder-by-user-id';

import { GetFolderQueryHandler } from './get-folder';
import { GetFolderByUserIdQueryHandler } from './get-folder-by-user-id';

export const FolderQueryHandlers = [GetFolderQueryHandler, GetFolderByUserIdQueryHandler];
