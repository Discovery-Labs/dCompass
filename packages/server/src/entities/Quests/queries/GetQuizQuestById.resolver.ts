import { NotFoundException } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";

import removeNulls from "../../../core/utils/helpers";
import { UseCeramicClient } from "../../../core/utils/types";
import { QuestService } from "../Quest.service";
import { QuizQuest } from "../QuizQuest.entity";

@Resolver(() => QuizQuest)
export class GetQuizQuestByIdResolver {
  constructor(private readonly questService: QuestService) {}
  @Query(() => QuizQuest, {
    nullable: true,
    description: "Gets a quiz quest by its ID",
    name: "getQuizQuestById",
  })
  async getQuizQuestById(
    @UseCeramic() { ceramicCore }: UseCeramicClient,
    @Args("questId") questId: string
  ): Promise<QuizQuest | null | undefined> {
    let foundQuest = null;
    foundQuest = await this.questService.quizQuestWithPathwayAndProjectSquads({
      id: questId,
    });

    if (!foundQuest) {
      const foundBountyQuest =
        await this.questService.bountyQuestWithPathwayAndProjectSquads({
          id: questId,
        });
      if (!foundBountyQuest) {
        throw new NotFoundException("Quest not found by back-end");
      }
      foundQuest = foundBountyQuest;
    }

    const questInfos = await ceramicCore.ceramic.loadStream(
      foundQuest.streamId
    );
    const questCreatorDID = questInfos.controllers[0];

    // TODO: append this data to createdBy
    // const questCreatorBasicProfile = await ceramicCore.get(
    //   "basicProfile",
    //   questCreatorDID
    // );

    const { pathway } = foundQuest;
    if (!pathway) {
      throw new NotFoundException("Quest has no parent pathway");
    }
    const { project } = pathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project");
    }

    return removeNulls({
      ...foundQuest,
      chainId: questInfos.content.chainId,
      namespace: questInfos.content.namespace,
      createdBy: questCreatorDID,
    });
  }
}
