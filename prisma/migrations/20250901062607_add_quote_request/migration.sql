-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "subServiceIds" INTEGER[],
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT NOT NULL,
    "webAddress" TEXT,
    "jobType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "returnFileFormat" TEXT NOT NULL,
    "linkType" TEXT NOT NULL,
    "dropboxLink" TEXT,
    "uploadedFilePaths" TEXT[],
    "numberOfPhotos" INTEGER NOT NULL,
    "instructions" TEXT NOT NULL,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);
