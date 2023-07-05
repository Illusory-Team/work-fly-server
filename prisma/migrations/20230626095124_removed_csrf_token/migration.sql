/*
  Warnings:

  - You are about to drop the `csrf_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "csrf_tokens" DROP CONSTRAINT "csrf_tokens_userId_fkey";

-- DropTable
DROP TABLE "csrf_tokens";
