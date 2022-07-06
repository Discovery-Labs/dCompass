-- AlterTable
ALTER TABLE "BountyQuest" ALTER COLUMN "rewardAmount" DROP NOT NULL,
ALTER COLUMN "rewardCurrency" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pathway" ALTER COLUMN "rewardAmount" DROP NOT NULL,
ALTER COLUMN "rewardCurrency" DROP NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuest" ALTER COLUMN "rewardAmount" DROP NOT NULL,
ALTER COLUMN "rewardCurrency" DROP NOT NULL;
