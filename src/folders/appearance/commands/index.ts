export { CreateFolderAppearanceCommand } from './create-folder-appearance';
export { PatchFolderAppearanceCommand } from './patch-folder-appearance';

import { CreateFolderAppearanceHandler } from './create-folder-appearance';
import { PatchFolderAppearanceHandler } from './patch-folder-appearance';

export const FolderAppearanceHandlers = [CreateFolderAppearanceHandler, PatchFolderAppearanceHandler];
