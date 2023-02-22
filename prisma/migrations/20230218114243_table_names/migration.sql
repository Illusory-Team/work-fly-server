/*
  Warnings:

  - You are about to drop the `Color` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ColorsOnCompanies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FolderAppearance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FolderIcon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FolderType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoldersOnUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ColorsOnCompanies" DROP CONSTRAINT "ColorsOnCompanies_colorId_fkey";

-- DropForeignKey
ALTER TABLE "ColorsOnCompanies" DROP CONSTRAINT "ColorsOnCompanies_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_folderAppearanceId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_folderTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "FolderAppearance" DROP CONSTRAINT "FolderAppearance_colorId_fkey";

-- DropForeignKey
ALTER TABLE "FolderAppearance" DROP CONSTRAINT "FolderAppearance_iconId_fkey";

-- DropForeignKey
ALTER TABLE "FoldersOnUsers" DROP CONSTRAINT "FoldersOnUsers_folderId_fkey";

-- DropForeignKey
ALTER TABLE "FoldersOnUsers" DROP CONSTRAINT "FoldersOnUsers_usersId_fkey";

-- DropTable
DROP TABLE "Color";

-- DropTable
DROP TABLE "ColorsOnCompanies";

-- DropTable
DROP TABLE "Folder";

-- DropTable
DROP TABLE "FolderAppearance";

-- DropTable
DROP TABLE "FolderIcon";

-- DropTable
DROP TABLE "FolderType";

-- DropTable
DROP TABLE "FoldersOnUsers";

-- CreateTable
CREATE TABLE "foldersOnUsers" (
    "folderId" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "foldersOnUsers_pkey" PRIMARY KEY ("folderId","usersId")
);

-- CreateTable
CREATE TABLE "colors" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colorsOnCompanies" (
    "companyId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "colorsOnCompanies_pkey" PRIMARY KEY ("companyId","colorId")
);

-- CreateTable
CREATE TABLE "folderIcons" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "folderIcons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folderAppearances" (
    "id" TEXT NOT NULL,
    "iconId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "folderAppearances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folderTypes" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "folderTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "folderAppearanceId" TEXT NOT NULL,
    "folderTypeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "foldersOnUsers" ADD CONSTRAINT "foldersOnUsers_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foldersOnUsers" ADD CONSTRAINT "foldersOnUsers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colorsOnCompanies" ADD CONSTRAINT "colorsOnCompanies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colorsOnCompanies" ADD CONSTRAINT "colorsOnCompanies_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folderAppearances" ADD CONSTRAINT "folderAppearances_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "folderIcons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folderAppearances" ADD CONSTRAINT "folderAppearances_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_folderAppearanceId_fkey" FOREIGN KEY ("folderAppearanceId") REFERENCES "folderAppearances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_folderTypeId_fkey" FOREIGN KEY ("folderTypeId") REFERENCES "folderTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
