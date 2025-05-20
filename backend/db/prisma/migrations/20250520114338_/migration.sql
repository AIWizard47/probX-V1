/*
  Warnings:

  - You are about to drop the column `amount` on the `Prediction` table. All the data in the column will be lost.
  - You are about to drop the column `tradeId` on the `Prediction` table. All the data in the column will be lost.
  - Added the required column `price` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Prediction" DROP CONSTRAINT "Prediction_tradeId_fkey";

-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "amount",
DROP COLUMN "tradeId",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
