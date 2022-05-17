import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { NotFoundException } from "@nestjs/common";

import { ForbiddenError } from "apollo-server-express";
import { AppService } from "../../../app.service";
import { BountyQuest } from "../BountyQuest.entity";
import { ApproveQuestSolutionInput } from "../dto/ApproveQuestSolution.input";
import { QuestService } from "../Quest.service";
import removeNulls from "../../../core/utils/helpers";
import { SiweMessageInput } from "../../Users/dto/SiweMessageInput";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";

@Resolver(() => BountyQuest)
export class ApproveQuestSolutionResolver {
  constructor(
    private readonly questService: QuestService,
    public readonly appService: AppService
  ) {}
  @Mutation(() => BountyQuest, {
    nullable: true,
    description: "Approve a solution for a BountyQuest in dCompass",
    name: "approveQuestSolution",
  })
  async approveQuestSolution(
    @UseSiwe() siwe: SiweMessageInput,
    @Args("input")
    { id, solutionId, adventurerDID }: ApproveQuestSolutionInput
  ): Promise<BountyQuest | null | undefined> {
    const foundBountyQuest =
      await this.questService.bountyQuestWithPathwayAndProjectSquads({
        id,
      });
    if (!foundBountyQuest) {
      throw new NotFoundException("Quest not found by back-end");
    }
    // Check if the current user is a project contributor
    const { pathway } = foundBountyQuest;
    if (!pathway) {
      throw new NotFoundException("Quest has no parent pathway");
    }
    const { project } = pathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project");
    }

    const { address } = siwe;
    // TODO: Keep track of address & network to avoid impersonation
    const projectContributors = project.squads
      ? project.squads.flatMap((squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    const isContributor = projectContributors.includes(address.toLowerCase());

    if (!isContributor) {
      throw new ForbiddenError("Unauthorized");
    }

    const existingSubmissions = foundBountyQuest.submissions ?? [];
    const currentSubmission = existingSubmissions.find(
      ({ did }: { did: string }) => did === adventurerDID
    );
    console.log({ currentSubmission });
    // remove previously pending submission and set it as approved
    // const approvedQuestSolution = {
    //   ...foundBountyQuest,
    //   submissions: [
    //     ...existingSubmissions.filter(
    //       ({ did }: { did: string }) => did === adventurerDID
    //     ),
    //     { ...currentSubmission, status: "approved" },
    //   ],
    // };
    const approvedQuestSolution =
      await this.questService.updateBountyQuestSubmission({
        where: {
          id: solutionId,
        },
        data: {
          status: "approved",
        },
      });

    const updatedQuest = await this.questService.updateBountyQuest({
      where: {
        id,
      },
      data: {
        completedBy: [...(foundBountyQuest.completedBy || []), adventurerDID],
      },
    });

    console.log({ approvedQuestSolution: approvedQuestSolution });

    return removeNulls(updatedQuest);
  }
}
