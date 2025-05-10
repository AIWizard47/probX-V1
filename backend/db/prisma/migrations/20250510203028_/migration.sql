/*
  Warnings:

  - You are about to drop the column `result` on the `Event` table. All the data in the column will be lost.
  - Added the required column `categary` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cratedTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventLogo` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventCategary" AS ENUM ('CRICKET', 'CRYPTO', 'YOUTUBE', 'INSTAGRAM', 'NEWS', 'TWEET', 'MOVIE', 'STOCKMARKET');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "result",
ADD COLUMN     "categary" "EventCategary" NOT NULL,
ADD COLUMN     "cratedTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "eventLogo" TEXT NOT NULL;
