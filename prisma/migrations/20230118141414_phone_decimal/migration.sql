/*
  Warnings:

  - You are about to alter the column `phone` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(16,0)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone" SET DATA TYPE DECIMAL(16,0);
