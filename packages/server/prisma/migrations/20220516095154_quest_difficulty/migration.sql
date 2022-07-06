/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Pathway` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestDifficultyEnum" AS ENUM ('ADVANCED', 'BEGINNER', 'EXPERT', 'INTERMEDIATE', 'WIZARD');

-- AlterTable
ALTER TABLE "BountyQuest" ADD COLUMN     "difficulty" "QuestDifficultyEnum" NOT NULL DEFAULT E'BEGINNER';

-- AlterTable
ALTER TABLE "Pathway" DROP COLUMN "difficulty";

-- AlterTable
ALTER TABLE "QuizQuest" ADD COLUMN     "difficulty" "QuestDifficultyEnum" NOT NULL DEFAULT E'BEGINNER';

-- DropEnum
DROP TYPE "PathwayDifficultyEnum";
