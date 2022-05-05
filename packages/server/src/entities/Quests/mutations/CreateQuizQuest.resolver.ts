import { Resolver, Mutation, Args } from "@nestjs/graphql";

import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseCeramicClient } from "../../../core/utils/types";
import { CreateQuestInput } from "../dto/CreateQuest.input";
import { QuizQuest } from "../QuizQuest.entity";
import { ForbiddenError } from "apollo-server-express";

import { QuestService } from "../Quest.service";
import removeNulls from "../../../core/utils/helpers";
import { SiweMessage } from "siwe";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";

@Resolver(() => QuizQuest)
export class CreateQuizQuestResolver {
  constructor(private readonly questService: QuestService) {}

  @Mutation(() => QuizQuest, {
    nullable: true,
    description: "Create a new Quiz quest in dCompass",
    name: "createQuizQuest",
  })
  async createQuizQuest(
    @UseSiwe() siwe: SiweMessage,
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input") { id }: CreateQuestInput
  ): Promise<QuizQuest | null | undefined> {
    // Check that the current user is the owner of the quest
    const ogQuest = await ceramicClient.ceramic.loadStream(id);
    const { pathwayId, questions, type, ...ogQuestInfos } = ogQuest.content;

    const { address } = siwe;

    const ownerAccounts = await ceramicClient.dataStore.get(
      "cryptoAccounts",
      ogQuest.controllers[0]
    );
    if (!ownerAccounts) throw new ForbiddenError("Unauthorized");
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split("@")[0]
    );

    if (!formattedAccounts.includes(address)) {
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
