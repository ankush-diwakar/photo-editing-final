/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactLead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FreeTrialLead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GalleryShowcase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobOpening` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceByCountry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuoteRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceImageCarousel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sliderimage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JobToSubService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GalleryShowcase" DROP CONSTRAINT "GalleryShowcase_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_editorId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_jobOpeningId_fkey";

-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_jobId_fkey";

-- DropForeignKey
ALTER TABLE "PriceByCountry" DROP CONSTRAINT "PriceByCountry_subServiceId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceImageCarousel" DROP CONSTRAINT "ServiceImageCarousel_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "SubService" DROP CONSTRAINT "SubService_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "_JobToSubService" DROP CONSTRAINT "_JobToSubService_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobToSubService" DROP CONSTRAINT "_JobToSubService_B_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "ContactLead";

-- DropTable
DROP TABLE "FreeTrialLead";

-- DropTable
DROP TABLE "GalleryShowcase";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "JobApplication";

-- DropTable
DROP TABLE "JobOpening";

-- DropTable
DROP TABLE "OTP";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PriceByCountry";

-- DropTable
DROP TABLE "QuoteRequest";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "ServiceImageCarousel";

-- DropTable
DROP TABLE "Sliderimage";

-- DropTable
DROP TABLE "SubService";

-- DropTable
DROP TABLE "Testimonial";

-- DropTable
DROP TABLE "_JobToSubService";

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactlead" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "service" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "ContactLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freetriallead" (
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

-- CreateTable
CREATE TABLE "galleryshowcase" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "beforeImage" TEXT NOT NULL,
    "afterImage" TEXT NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GalleryShowcase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "dropboxLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "editorDropboxLink" TEXT,
    "instructions" TEXT,
    "numberOfPhotos" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "editorId" INTEGER,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobapplication" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "currentCompany" TEXT,
    "currentDesignation" TEXT,
    "currentCTC" TEXT,
    "expectedCTC" TEXT,
    "currentLocation" TEXT NOT NULL,
    "overallExperience" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "noticePeriod" TEXT NOT NULL,
    "coverLetterPath" TEXT,
    "resumePath" TEXT,
    "portfolioLink" TEXT,
    "jobOpeningId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobopening" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "postedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT DEFAULT 'https://placehold.co/70x70?text=JD',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOpening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "clientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,
    "seriesType" "SeriesType" NOT NULL,
    "seriesNumber" TEXT NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "clientGstin" TEXT,
    "clientAddress" TEXT NOT NULL,
    "clientCity" TEXT NOT NULL,
    "clientState" TEXT NOT NULL,
    "clientCountry" TEXT NOT NULL,
    "cgstAmount" DECIMAL(10,2),
    "sgstAmount" DECIMAL(10,2),
    "igstAmount" DECIMAL(10,2),
    "totalTaxAmount" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricebycountry" (
    "id" SERIAL NOT NULL,
    "subServiceId" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "PriceByCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quoterequest" (
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

-- CreateTable
CREATE TABLE "service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "afterImage" TEXT NOT NULL,
    "beforeImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER DEFAULT 0,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serviceimagecarousel" (
    "id" SERIAL NOT NULL,
    "imageName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "serviceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceImageCarousel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sliderimage" (
    "id" SERIAL NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sliderimage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subservice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "serviceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "afterImage" TEXT,
    "beforeImage" TEXT,
    "order" INTEGER DEFAULT 0,

    CONSTRAINT "SubService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonial" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_jobtosubservice" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_username_key" ON "client"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_jobId_key" ON "payment"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_seriesNumber_key" ON "payment"("seriesNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_invoiceNumber_key" ON "payment"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PriceByCountry_subServiceId_currency_key" ON "pricebycountry"("subServiceId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "service"("name");

-- CreateIndex
CREATE INDEX "ServiceImageCarousel_serviceId_order_idx" ON "serviceimagecarousel"("serviceId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceImageCarousel_serviceId_order_key" ON "serviceimagecarousel"("serviceId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "SubService_name_serviceId_key" ON "subservice"("name", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "_jobtosubservice_AB_unique" ON "_jobtosubservice"("A", "B");

-- CreateIndex
CREATE INDEX "_jobtosubservice_B_index" ON "_jobtosubservice"("B");

-- AddForeignKey
ALTER TABLE "galleryshowcase" ADD CONSTRAINT "GalleryShowcase_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "Job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "Job_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobapplication" ADD CONSTRAINT "JobApplication_jobOpeningId_fkey" FOREIGN KEY ("jobOpeningId") REFERENCES "jobopening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "OTP_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "Payment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricebycountry" ADD CONSTRAINT "PriceByCountry_subServiceId_fkey" FOREIGN KEY ("subServiceId") REFERENCES "subservice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceimagecarousel" ADD CONSTRAINT "ServiceImageCarousel_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subservice" ADD CONSTRAINT "SubService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jobtosubservice" ADD CONSTRAINT "_jobtosubservice_A_fkey" FOREIGN KEY ("A") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jobtosubservice" ADD CONSTRAINT "_jobtosubservice_B_fkey" FOREIGN KEY ("B") REFERENCES "subservice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
