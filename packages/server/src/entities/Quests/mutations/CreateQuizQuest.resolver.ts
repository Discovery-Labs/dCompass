import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ethers } from "ethers";

import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseCeramicClient } from "../../../core/utils/types";
import { CreateQuestInput } from "../dto/CreateQuest.input";
import { QuizQuest } from "../QuizQuest.entity";
import { ForbiddenError } from "apollo-server-express";

import { QuestService } from "../Quest.service";
import removeNulls from "../../../core/utils/helpers";

@Resolver(() => QuizQuest)
export class CreateQuizQuestResolver {
  constructor(private readonly questService: QuestService) {}

  @Mutation(() => QuizQuest, {
    nullable: true,
    description: "Create a new Quiz quest in dCompass",
    name: "createQuizQuest",
  })
  async createQuizQuest(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input") { id, questCreatorSignature }: CreateQuestInput
  ): Promise<QuizQuest | null | undefined> {
    // Check that the current user is the owner of the quest
    const ogQuest = await ceramicClient.ceramic.loadStream(id);
    const { pathwayId, questions, type, ...ogQuestInfos } = ogQuest.content;
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id, pathwayId }),
      questCreatorSignature
    );
    console.log({ decodedAddress, controllers: ogQuest.controllers });

    const ownerAccounts = await ceramicClient.dataStore.get(
      "cryptoAccounts",
      ogQuest.controllers[0]
    );
    console.log({ ownerAccounts });
    if (!ownerAccounts) throw new ForbiddenError("Unauthorized");
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split("@")[0]
    );

    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError("Unauthorized");
    }

    const createdQuest = await this.questService.createQuizQuest({
      pathway: {
        connect: {
          id: pathwayId,
        },
      },
      ...ogQuestInfos,
      questions: {
        createMany: {
          data: questions,
          skipDuplicates: true,
        },
      },
      questType: type.value,
      streamId: id,
      isPending: true,
      createdBy: ogQuest.controllers[0],
    });

    return removeNulls(createdQuest);
  }
}
