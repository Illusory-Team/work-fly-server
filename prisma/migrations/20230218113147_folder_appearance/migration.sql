/*
  Warnings:

  - Added the required column `folderAppearanceId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "folderAppearanceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FolderIcon" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "FolderIcon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FolderAppearance" (
    "id" TEXT NOT NULL,
    "iconId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "FolderAppearance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FolderAppearance" ADD CONSTRAINT "FolderAppearance_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "FolderIcon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderAppearance" ADD CONSTRAINT "FolderAppearance_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_folderAppearanceId_fkey" FOREIGN KEY ("folderAppearanceId") REFERENCES "FolderAppearance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
