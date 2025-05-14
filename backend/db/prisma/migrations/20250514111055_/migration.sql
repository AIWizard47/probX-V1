-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventCategary" ADD VALUE 'FOOTBALL';
ALTER TYPE "EventCategary" ADD VALUE 'GAMING';
ALTER TYPE "EventCategary" ADD VALUE 'CHESS';
ALTER TYPE "EventCategary" ADD VALUE 'KABBADI';
ALTER TYPE "EventCategary" ADD VALUE 'PRIDICTX';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "noPrice" DOUBLE PRECISION NOT NULL DEFAULT 5,
ADD COLUMN     "yesPrice" DOUBLE PRECISION NOT NULL DEFAULT 5;
