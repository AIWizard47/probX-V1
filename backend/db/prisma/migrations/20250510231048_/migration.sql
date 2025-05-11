/*
  Warnings:

  - Added the required column `orderType` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderType` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeLogo` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "orderType" "OrderType" NOT NULL;

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "orderType" "OrderType" NOT NULL,
ADD COLUMN     "tradeLogo" TEXT NOT NULL;
