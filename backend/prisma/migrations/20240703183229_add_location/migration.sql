/*
  Warnings:

  - You are about to drop the column `interview_location` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "interview_location",
ADD COLUMN     "location" TEXT;
