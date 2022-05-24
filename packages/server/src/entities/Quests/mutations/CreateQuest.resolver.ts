import { Resolver, Mutation, Args } from "@nestjs/graphql";

import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseCeramicClient } from "../../../core/utils/types";
import { CreateQuestInput } from "../dto/CreateQuest.input";
import { Quest } from "../Quest.entity";
import { ForbiddenError } from "apollo-server-express";
import { QuestService } from "../Quest.service";
import removeNulls from "../../../core/utils/helpers";
import { SiweMessage } from "siwe";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";

@Resolver(() => Quest)
export class CreateQuestResolver {
  constructor(private readonly questService: QuestService) {}

  @Mutation(() => Quest, {
    nullable: true,
    description: "Create a new Quest in dCompass",
    name: "createQuest",
  })
  async createQuest(
    @UseSiwe() siwe: SiweMessage,
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input") { id }: CreateQuestInput
  ): Promise<Quest | null | undefined> {
    // Check that the current user is the owner of the quest
    const ogQuest = await ceramicClient.ceramic.loadStream(id);
    const { pathwayId, type, ...ogQuestInfos } = ogQuest.content;

    const { address } = siwe;

    const ownerAccounts = await ceramicClient.dataStore.get(
      "cryptoAccounts",
      ogQuest.controllers[0]
    );
    if (!ownerAccounts) throw new ForbiddenError("Unauthorized");
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split("@")[0]
    );

    if (
      !formattedAccounts.includes(address) ||
      ogQuest.content.createdBy !== address
    ) {
      throw new ForbiddenError("Unauthorized");
    }

    const createdQuest = await this.questService.createBountyQuest({
      pathway: {
        connect: {
          id: pathwayId,
        },
      },
      ...ogQuestInfos,
      questType: type.value,
      streamId: id,
      isPending: true,
    });

    return removeNulls(createdQuest);
  }
}
