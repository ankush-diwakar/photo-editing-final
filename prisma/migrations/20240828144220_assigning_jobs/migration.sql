-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "editorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
