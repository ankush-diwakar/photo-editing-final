-- CreateTable
CREATE TABLE "JobApplication" (
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

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobOpeningId_fkey" FOREIGN KEY ("jobOpeningId") REFERENCES "JobOpening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
