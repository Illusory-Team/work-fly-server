/*
  Warnings:

  - You are about to drop the column `positionId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_positionId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "positionId";
