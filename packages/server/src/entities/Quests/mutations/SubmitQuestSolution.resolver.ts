import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ForbiddenError } from "apollo-server-express";

import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { AppService } from "../../../app.service";
import { ethers } from "ethers";
import { QuestSolutionSubmissionInput } from "../dto/QuestSolutionSubmission.input";
import { QuestService } from "../Quest.service";

@Resolver(() => Boolean)
export class SubmitQuestSolutionResolver {
  constructor(
    private readonly questService: QuestService,
    public readonly appService: AppService
  ) {}
  @Mutation(() => Boolean, {
    nullable: false,
    description: "Submits quest solution",
    name: "submitQuestSolution",
  })
  async submitQuestSolution(
    @Args("input") solutionSubmission: QuestSolutionSubmissionInput
  ): Promise<boolean> {
    const foundQuest =
      await this.questService.bountyQuestWithPathwayAndProjectSquads({
        id: solutionSubmission.questId,
      });
    if (!foundQuest) {
      throw new NotFoundException("Quest not found");
    }

    const { pathway } = foundQuest;
    if (!pathway) {
      throw new NotFoundException("Quest has no parent pathway");
    }
    const { project } = pathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project");
    }

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({
        id: solutionSubmission.questId,
        pathwayId: foundQuest.pathwayId,
      }),
      solutionSubmission.questAdventurerSignature
    );
    console.log({ decodedAddress });
    if (!decodedAddress) {
      throw new ForbiddenException("Unauthorized");
    }

    const alreadySubmittedBy = foundQuest.submissions
      ? foundQuest.submissions.map(({ did }: { did: string }) => did)
      : [];
    const alreadyCompletedBy = foundQuest.completedBy ?? [];
    const isQuestAlreadyCompleted = alreadyCompletedBy.includes(
      solutionSubmission.did
    );
    const isQuestAlreadySubmitted = alreadySubmittedBy.includes(
      solutionSubmission.did
    );
    if (isQuestAlreadySubmitted) {
      throw new ForbiddenError("Quest solution already submitted");
    }
    if (isQuestAlreadyCompleted) {
      throw new ForbiddenError("Quest already completed");
    }
    const newSubmission = {
      did: solutionSubmission.did,
      solution: solutionSubmission.solution,
      status: "under-review",
    };

    await this.questService.updateBountyQuest({
      where: {
        id: foundQuest.id,
      },
      data: {
        submissions: {
          create: newSubmission,
        },
      },
    });

    return true;
  }
}
