-- CreateTable
CREATE TABLE "ServiceImageCarousel" (
    "id" SERIAL NOT NULL,
    "imageName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "serviceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceImageCarousel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceImageCarousel_serviceId_order_idx" ON "ServiceImageCarousel"("serviceId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceImageCarousel_serviceId_order_key" ON "ServiceImageCarousel"("serviceId", "order");

-- AddForeignKey
ALTER TABLE "ServiceImageCarousel" ADD CONSTRAINT "ServiceImageCarousel_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
