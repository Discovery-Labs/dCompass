import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";
import { ethers } from "ethers";

import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";

import removeNulls from "../../../core/utils/helpers";
import { UseCeramicClient } from "../../../core/utils/types";

import { BountyQuest } from "../BountyQuest.entity";
import { GetBountyQuestByIdInput } from "../dto/GetBountyQuestById.input";
import { QuestService } from "../Quest.service";

// type SolutionSubmission = {
//   did: string;
//   solution: string;
//   reviewComment?: string;
//   status: string;
// };
@Resolver(() => BountyQuest)
export class GetBountyQuestByIdResolver {
  constructor(private readonly questService: QuestService) {}
  @Query(() => BountyQuest, {
    nullable: true,
    description: "Gets a quiz quest by its ID",
    name: "getBountyQuestById",
  })
  async getBountyQuestById(
    @UseCeramic() { ceramicClient, ceramicCore }: UseCeramicClient,
    @Args("input") { questId, did, signature }: GetBountyQuestByIdInput
  ): Promise<BountyQuest | null | undefined> {
    const foundQuest =
      await this.questService.bountyQuestWithPathwayAndProjectSquads({
        id: questId,
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

    const questInfos = await ceramicCore.ceramic.loadStream(
      foundQuest.streamId
    );
    const questCreatorDID = questInfos.controllers[0];

    // const questCreatorBasicProfile = await ceramicCore.get(
    //   "basicProfile",
    //   questCreatorDID
    // );

    // TODO:
    // 1. check if signature matches an address in the crypto accounts of the did provided
    const decodedAddress = ethers.utils.verifyMessage(did, signature);
    console.log({ decodedAddress });
    if (!decodedAddress) {
      throw new ForbiddenException("Unauthorized");
    }

    // 2. check if decoded address is in project contributors
    // TODO: Keep track of address & network to avoid impersonation
    const projectContributors = project.squads
      ? project.squads.flatMap((squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    const isProjectContributor = projectContributors.includes(
      decodedAddress.toLowerCase()
    );

    console.log({ isProjectContributor });

    let decryptedSolutions = [] as any[];

    if (isProjectContributor) {
      const parsedSubmissions = foundQuest.submissions.map((submission) => ({
        ...submission,
        solution: JSON.parse(submission.solution),
      }));

      console.log({ parsedSubmissions });
      decryptedSolutions = await Promise.all(
        parsedSubmissions.map(async (submission) => {
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
    return removeNulls({
      ...foundQuest,
      submissions:
        decryptedSolutions.length > 0
          ? decryptedSolutions
          : foundQuest.submissions || [],
      chainId: questInfos.content.chainId,
      namespace: questInfos.content.namespace,
      createdBy: questCreatorDID,
      // createdBy: {
      //   did: questCreatorDID,
      //   name: questCreatorBasicProfile?.name || "",
      // },
      isProjectContributor,
    });
  }
}
