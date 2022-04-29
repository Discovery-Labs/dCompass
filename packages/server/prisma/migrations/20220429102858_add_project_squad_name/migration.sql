/*
  Warnings:

  - Added the required column `name` to the `ProjectSquad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectSquad" ADD COLUMN     "name" TEXT NOT NULL;
