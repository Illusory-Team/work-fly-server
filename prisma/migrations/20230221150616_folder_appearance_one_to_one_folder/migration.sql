/*
  Warnings:

  - You are about to drop the column `folderAppearanceId` on the `folders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_folderAppearanceId_fkey";

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "folderAppearanceId";

-- AddForeignKey
ALTER TABLE "folderAppearances" ADD CONSTRAINT "folderAppearances_id_fkey" FOREIGN KEY ("id") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
