-- CreateTable
CREATE TABLE "FoldersOnUsers" (
    "folderId" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "FoldersOnUsers_pkey" PRIMARY KEY ("folderId","usersId")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoldersOnUsers" ADD CONSTRAINT "FoldersOnUsers_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoldersOnUsers" ADD CONSTRAINT "FoldersOnUsers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
