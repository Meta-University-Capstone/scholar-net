/*
  Warnings:

  - Added the required column `field_interest` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "field_interest" TEXT NOT NULL;
