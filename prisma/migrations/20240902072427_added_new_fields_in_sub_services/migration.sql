-- AlterTable
ALTER TABLE "PriceByCountry" ALTER COLUMN "currency" SET DEFAULT 'USD';

-- AlterTable
ALTER TABLE "SubService" ADD COLUMN     "afterImage" TEXT,
ADD COLUMN     "beforeImage" TEXT;
