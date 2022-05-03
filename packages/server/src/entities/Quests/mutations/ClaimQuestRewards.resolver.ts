import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ethers } from "ethers";
import ABIS from "@discovery-dao/hardhat/abis.json";

import { UseCeramicClient } from "../../../core/utils/types";
import { Quest } from "../Quest.entity";
import { verifyAdventurerClaimInfo } from "../../../core/utils/security/verify";
import { AppService } from "../../../app.service";

import { ForbiddenException, NotFoundException } from "@nestjs/common";

import { ClaimQuestRewardsInput } from "../dto/ClaimQuestRewards.input";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { ForbiddenError } from "apollo-server-express";
import { QuestService } from "../Quest.service";
import removeNulls from "../../../core/utils/helpers";

@Resolver(() => Quest)
export class ClaimQuestRewardsResolver {
  constructor(
    public readonly appService: AppService,
    private readonly questService: QuestService
  ) {}

  @Mutation(() => Quest, {
    nullable: true,
    description: "Verify a new Quest right before minting in dCompass",
    name: "claimQuestRewards",
  })
  async claimQuestRewards(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input")
    {
      questId,
      questType,
      did,
      questAdventurerSignature,
      chainId,
    }: ClaimQuestRewardsInput
  ): Promise<Quest | null | undefined> {
    let foundQuest = null;
    if (questType === "quiz") {
      foundQuest = await this.questService.quizQuestWithPathwayAndProjectSquads(
        {
          id: questId,
        }
      );
    }
    if (questType === "bounty") {
      foundQuest =
        await this.questService.bountyQuestWithPathwayAndProjectSquads({
          id: questId,
        });
    }

    if (!foundQuest) {
      throw new NotFoundException("Quest not found by back-end");
    }
    const { pathwayId } = foundQuest;

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: questId, pathwayId }),
      questAdventurerSignature
    );

    if (!decodedAddress) {
      throw new ForbiddenException("Unauthorized");
    }

    // Check that the quest Adventurer is the person he claims to be
    const adventurerAccounts = await ceramicClient.dataStore.get(
      "cryptoAccounts",
      did
    );
    console.log({ adventurerAccounts, decodedAddress });
    if (!adventurerAccounts) throw new ForbiddenError("Unauthorized");
    const formattedAccounts = Object.keys(adventurerAccounts).map(
      (account) => account.split("@")[0]
    );
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError("Unauthorized");
    }

    // Check that the user has already completed the quest
    const isCompleted = foundQuest.completedBy?.includes(did);
    if (!isCompleted) {
      throw new ForbiddenError("Quest not completed yet!");
    }

    const chainIdStr = chainId.toString();
    if (!Object.keys(ABIS).includes(chainIdStr)) {
      throw new Error("Unsupported Network");
    }

    const questContract = this.appService.getContract(chainIdStr, "BadgeNFT");
    const metadataNonceId = await questContract.nonces(
      foundQuest.streamId,
      decodedAddress
    );
    console.log({ metadataNonceId });
    const { r, s, v } = await verifyAdventurerClaimInfo({
      contractAddress: questContract.address,
      nonceId: metadataNonceId,
      objectId: foundQuest.streamId,
      senderAddress: decodedAddress,
      chainId,
      verifyContract: questContract.address,
    });

    return removeNulls({
      ...foundQuest,
      expandedServerSignatures: [{ r, s, v }],
    });
  }
}
