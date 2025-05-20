/*
  Warnings:

  - Added the required column `tradeId` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "tradeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
