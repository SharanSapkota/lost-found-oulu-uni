/*
  Warnings:

  - A unique constraint covering the columns `[pickupCode]` on the table `claims` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "claims" ADD COLUMN     "pickupCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "claims_pickupCode_key" ON "claims"("pickupCode");
