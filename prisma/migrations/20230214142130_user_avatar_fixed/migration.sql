/*
  Warnings:

  - You are about to drop the column `avatar` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "avatar";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT;
