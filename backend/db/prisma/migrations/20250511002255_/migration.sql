/*
  Warnings:

  - Added the required column `category` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "category" TEXT NOT NULL;
