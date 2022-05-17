/*
  Warnings:

  - You are about to drop the column `isProjectContributor` on the `BountyQuest` table. All the data in the column will be lost.
  - You are about to drop the column `isProjectContributor` on the `QuizQuest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BountyQuest" DROP COLUMN "isProjectContributor",
ALTER COLUMN "namespace" DROP NOT NULL,
ALTER COLUMN "namespace" SET DEFAULT E'eip155';

-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "namespace" DROP NOT NULL,
ALTER COLUMN "chainId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuest" DROP COLUMN "isProjectContributor",
ALTER COLUMN "namespace" DROP NOT NULL,
ALTER COLUMN "namespace" SET DEFAULT E'eip155';
