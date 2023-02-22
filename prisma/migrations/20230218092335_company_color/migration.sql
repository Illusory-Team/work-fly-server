-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorsOnCompanies" (
    "companyId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "ColorsOnCompanies_pkey" PRIMARY KEY ("companyId","colorId")
);

-- AddForeignKey
ALTER TABLE "ColorsOnCompanies" ADD CONSTRAINT "ColorsOnCompanies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorsOnCompanies" ADD CONSTRAINT "ColorsOnCompanies_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
