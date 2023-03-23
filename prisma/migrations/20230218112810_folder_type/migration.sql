/*
  Warnings:

  - Added the required column `folderTypeId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "folderTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FolderType" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "FolderType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_folderTypeId_fkey" FOREIGN KEY ("folderTypeId") REFERENCES "FolderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
