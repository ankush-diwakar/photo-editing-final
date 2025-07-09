/*
  Warnings:

  - You are about to drop the column `payerName` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `clientEmail` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientPhone` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payerName",
ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "clientPhone" TEXT NOT NULL;
