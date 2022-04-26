import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Where } from "@textile/hub";
import { NotFoundException } from "@nestjs/common";

import { UseThreadDBClient } from "../../../core/utils/types";
import { ThreadDBService } from "../../../services/thread-db/thread-db.service";
import { UseThreadDB } from "../../../core/decorators/UseThreadDB.decorator";
import { ethers } from "ethers";
import { Squad } from "../../Squads/Squad.entity";
import { ForbiddenError } from "apollo-server-express";
import { AppService } from "../../../app.service";
import { BountyQuest } from "../BountyQuest.entity";
import { ApproveQuestSolutionInput } from "../dto/ApproveQuestSolution.input";

@Resolver(() => BountyQuest)
export class ApproveQuestSolutionResolver {
  constructor(
    private readonly threadDBService: ThreadDBService,
    public readonly appService: AppService
  ) {}
  @Mutation(() => BountyQuest, {
    nullable: true,
    description: "Approve a solution Quest in dCompass",
    name: "approveQuestSolution",
  })
  async approveQuestSolution(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args("input")
    { id, solutionApproverSignature, adventurerDID }: ApproveQuestSolutionInput
  ): Promise<BountyQuest | null | undefined> {
    const [foundQuest] = await this.threadDBService.query({
      collectionName: "Quest",
      dbClient,
      threadId: latestThreadId,
      query: new Where("_id").eq(id),
    });
    if (!foundQuest) {
      throw new NotFoundException("Quest not found by back-end");
    }
    const quest = foundQuest as any;
    // Check if the current user is a project contributor
    const foundPathway = await this.threadDBService.getPathwayById({
      dbClient,
      threadId: latestThreadId,
      pathwayId: quest.pathwayId,
    });
    const { projectId } = foundPathway;
    const foundProject = await this.threadDBService.getProjectById({
      dbClient,
      threadId: latestThreadId,
      projectId,
    });
    console.log({ foundProject });

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, pathwayId: quest.pathwayId, adventurerDID }),
      solutionApproverSignature
    );
    // TODO: Keep track of address & network to avoid impersonation
    console.log({ decodedAddress });
    const projectContributors = foundProject.squads
      ? foundProject.squads.flatMap((squad: Squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    const isContributor = projectContributors.includes(
      decodedAddress.toLowerCase()
    );

    console.log({ isContributor });
    if (!isContributor) {
      throw new ForbiddenError("Unauthorized");
    }

    const existingSubmissions = quest.submissions ?? [];
    const currentSubmission = existingSubmissions.find(
      ({ did }: { did: string }) => did === adventurerDID
    );
    console.log({ currentSubmission });
    // remove previously pending submission and set it as approved
    const updatedQuest = {
      ...quest,
      submissions: [
        ...existingSubmissions.filter(
          ({ did }: { did: string }) => did === adventurerDID
        ),
        { ...currentSubmission, status: "approved" },
      ],
    };

    console.log({ updatedQuestS: updatedQuest.submissions });

    const updated = await this.threadDBService.update({
      collectionName: "Quest",
      threadId: latestThreadId,
      dbClient,
      values: [updatedQuest],
    });

    console.log({ updated });

    return {
      ...updatedQuest,
      id,
    };
  }
}
