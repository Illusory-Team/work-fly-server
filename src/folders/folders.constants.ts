export const FOLDER_SELECT = {
  id: true,
  name: true,
  folderAppearance: { select: { icon: { select: { icon: true } }, color: { select: { color: true } } } },
  folderType: { select: { type: true } },
  users: { select: { users: { select: { id: true, fullName: true, avatar: true } } }, take: 2 },
  owner: { select: { id: true, fullName: true, avatar: true } },
  _count: { select: { users: true } },
};
