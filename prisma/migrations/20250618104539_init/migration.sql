-- CreateTable
CREATE TABLE "FreeTrialLead" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "brief" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "imageLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreeTrialLead_pkey" PRIMARY KEY ("id")
);
