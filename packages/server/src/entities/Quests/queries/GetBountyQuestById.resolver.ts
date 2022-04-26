import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";
import { Where } from "@textile/hub";
import { ethers } from "ethers";
import { Squad } from "src/entities/Squads/Squad.entity";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";

import { UseThreadDB } from "../../../core/decorators/UseThreadDB.decorator";
import { UseCeramicClient, UseThreadDBClient } from "../../../core/utils/types";
import { ThreadDBService } from "../../../services/thread-db/thread-db.service";
import { BountyQuest } from "../BountyQuest.entity";
import { GetBountyQuestByIdInput } from "../dto/GetBountyQuestById.input";

type SolutionSubmission = {
  did: string;
  solution: string;
  reviewComment?: string;
  status: string;
};
@Resolver(() => BountyQuest)
export class GetBountyQuestByIdResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Query(() => BountyQuest, {
    nullable: true,
    description: "Gets a quiz quest by its ID",
    name: "getBountyQuestById",
  })
  async getBountyQuestById(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @UseCeramic() { ceramicClient, ceramicCore }: UseCeramicClient,
    @Args("input") { questId, did, signature }: GetBountyQuestByIdInput
  ): Promise<BountyQuest | null | undefined> {
    const [foundQuest] = await this.threadDBService.query({
      collectionName: "Quest",
      dbClient,
      threadId: latestThreadId,
      query: new Where("_id").eq(questId),
    });
    if (!foundQuest) {
      throw new NotFoundException("Quest not found");
    }
    const { _id, type, ...quest } = foundQuest as any;
    const questInfos = await ceramicCore.ceramic.loadStream(quest.streamId);
    const questCreatorDID = questInfos.controllers[0];
    const questCreatorBasicProfile = await ceramicCore.get(
      "basicProfile",
      questCreatorDID
    );

    const [foundPathway] = await this.threadDBService.query({
      collectionName: "Pathway",
      dbClient,
      threadId: latestThreadId,
      query: new Where("_id").eq(quest.pathwayId),
    });
    if (!foundPathway) {
      throw new NotFoundException("Pathway not found");
    }
    const { _id: pathwayId, ...pathway } = foundPathway as any;

    // TODO:
    // 1. check if signature matches an address in the crypto accounts of the did provided
    const decodedAddress = ethers.utils.verifyMessage(did, signature);
    console.log({ decodedAddress });
    if (!decodedAddress) {
      throw new ForbiddenException("Unauthorized");
    }
    const { projectId } = pathway;
    const foundProject = await this.threadDBService.getProjectById({
      dbClient,
      threadId: latestThreadId,
      projectId,
    });

    if (!foundProject) {
      throw new NotFoundException("Project not found");
    }

    // 2. check if decoded address is in project contributors
    // TODO: Keep track of address & network to avoid impersonation
    const projectContributors = foundProject.squads
      ? foundProject.squads.flatMap((squad: Squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    const isProjectContributor = projectContributors.includes(
      decodedAddress.toLowerCase()
    );

    console.log({ isProjectContributor });

    let decryptedSolutions = [];

    if (isProjectContributor) {
      const parsedSubmissions = quest.submissions.map(
        (submission: SolutionSubmission) => ({
          ...submission,
          solution: JSON.parse(submission.solution),
        })
      );

      console.log({ parsedSubmissions });
      decryptedSolutions = await Promise.all(
        parsedSubmissions.map(async (submission: any) => {
          const decryptedSolution =
            await ceramicClient.ceramic.did?.decryptDagJWE(submission.solution);
          return {
            ...submission,
            solution: JSON.stringify(decryptedSolution),
          };
        })
      );
      console.log({ decryptedSolutions });
    }
    // 3. if is project contributor then decrypt solutions otherwhise keep as is.
    return {
      id: _id,
      ...quest,
      submissions:
        decryptedSolutions.length > 0
          ? decryptedSolutions
          : quest.submissions || [],
      chainId: questInfos.content.chainId,
      namespace: questInfos.content.namespace,
      questType: type.value,
      createdBy: {
        did: questCreatorDID,
        name: questCreatorBasicProfile?.name || "",
      },
      pathway: {
        id: pathwayId,
        ...pathway,
      },
      isProjectContributor,
    };
  }
}
