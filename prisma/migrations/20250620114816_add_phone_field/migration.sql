/*
  Warnings:

  - Added the required column `phone` to the `ContactLead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactLead" ADD COLUMN     "phone" TEXT NOT NULL;
