/*
  Warnings:

  - Added the required column `companyId` to the `positiongs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "positiongs" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "positiongs" ADD CONSTRAINT "positiongs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
