-- CreateEnum
CREATE TYPE "PathwayDifficultyEnum" AS ENUM ('ADVANCED', 'BEGINNER', 'EXPERT', 'INTERMEDIATE', 'WIZARD');

-- CreateEnum
CREATE TYPE "SponsorTierEnum" AS ENUM ('SILVER', 'GOLD', 'DIAMOND');

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "namespace" TEXT NOT NULL DEFAULT E'eip155',
    "chainId" TEXT NOT NULL DEFAULT E'1',
    "contractAddress" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "answer" TEXT NOT NULL,
    "choices" TEXT[],
    "question" TEXT NOT NULL,
    "questId" TEXT,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionSubmission" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "did" TEXT NOT NULL,
    "reviewComment" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "questId" TEXT,

    CONSTRAINT "SolutionSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BountyQuest" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "completedBy" TEXT[],
    "createdBy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "isPending" BOOLEAN NOT NULL,
    "isProjectContributor" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "pathwayId" TEXT,
    "questType" TEXT NOT NULL,
    "rewardAmount" DOUBLE PRECISION NOT NULL,
    "rewardCurrency" TEXT NOT NULL,
    "rewardUserCap" INTEGER NOT NULL,
    "slogan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BountyQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuest" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "completedBy" TEXT[],
    "createdAt" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "isPending" BOOLEAN NOT NULL,
    "isProjectContributor" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "pathwayId" TEXT,
    "questType" TEXT NOT NULL,
    "rewardAmount" DOUBLE PRECISION NOT NULL,
    "rewardCurrency" TEXT NOT NULL,
    "rewardUserCap" INTEGER NOT NULL,
    "slogan" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "QuizQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pathway" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "PathwayDifficultyEnum" NOT NULL,
    "image" TEXT NOT NULL,
    "isPending" BOOLEAN NOT NULL,
    "prerequisites" TEXT[],
    "projectStreamId" TEXT NOT NULL,
    "rewardAmount" DOUBLE PRECISION NOT NULL,
    "rewardCurrency" TEXT NOT NULL,
    "rewardUserCap" INTEGER NOT NULL,
    "slogan" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "Pathway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSquad" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "members" TEXT[],
    "projectId" TEXT,

    CONSTRAINT "ProjectSquad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "sponsorTier" "SponsorTierEnum" NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "projectWallet" TEXT NOT NULL,
    "twitter" TEXT,
    "discord" TEXT,
    "github" TEXT,
    "gitbook" TEXT,
    "logo" TEXT,
    "image" TEXT,
    "tokenUris" TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "parentProjectId" TEXT,
    "whitePaper" TEXT,
    "demoVideo" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "did" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_did_key" ON "User"("did");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTag_AB_unique" ON "_ProjectToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTag_B_index" ON "_ProjectToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToUser_AB_unique" ON "_ProjectToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToUser_B_index" ON "_ProjectToUser"("B");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_questId_fkey" FOREIGN KEY ("questId") REFERENCES "QuizQuest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionSubmission" ADD CONSTRAINT "SolutionSubmission_questId_fkey" FOREIGN KEY ("questId") REFERENCES "BountyQuest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BountyQuest" ADD CONSTRAINT "BountyQuest_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuest" ADD CONSTRAINT "QuizQuest_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pathway" ADD CONSTRAINT "Pathway_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSquad" ADD CONSTRAINT "ProjectSquad_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_parentProjectId_fkey" FOREIGN KEY ("parentProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTag" ADD CONSTRAINT "_ProjectToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTag" ADD CONSTRAINT "_ProjectToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
