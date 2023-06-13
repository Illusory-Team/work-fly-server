export { CreateFolderAppearanceCommand } from './create-folder-appearance';
export { PatchFolderAppearanceCommand } from './patch-folder-appearance';

import { CreateFolderAppearanceCommandHandler } from './create-folder-appearance';
import { PatchFolderAppearanceCommandHandler } from './patch-folder-appearance';

export const FolderAppearanceCommandHandlers = [
  CreateFolderAppearanceCommandHandler,
  PatchFolderAppearanceCommandHandler,
];
