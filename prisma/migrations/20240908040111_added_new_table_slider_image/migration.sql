-- CreateTable
CREATE TABLE "Sliderimage" (
    "id" SERIAL NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sliderimage_pkey" PRIMARY KEY ("id")
);
