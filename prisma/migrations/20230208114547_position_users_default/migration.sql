-- AlterTable
ALTER TABLE "users" ADD COLUMN     "positionId" TEXT NOT NULL DEFAULT '1f61f4d3-779b-43ee-9c92-73d74e831a7a';

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positiongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
