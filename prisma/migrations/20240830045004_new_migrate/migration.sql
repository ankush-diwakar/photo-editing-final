/*
  Warnings:

  - You are about to drop the column `subServiceId` on the `Job` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_subServiceId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "subServiceId";

-- CreateTable
CREATE TABLE "_JobToSubService" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JobToSubService_AB_unique" ON "_JobToSubService"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToSubService_B_index" ON "_JobToSubService"("B");

-- AddForeignKey
ALTER TABLE "_JobToSubService" ADD CONSTRAINT "_JobToSubService_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToSubService" ADD CONSTRAINT "_JobToSubService_B_fkey" FOREIGN KEY ("B") REFERENCES "SubService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
