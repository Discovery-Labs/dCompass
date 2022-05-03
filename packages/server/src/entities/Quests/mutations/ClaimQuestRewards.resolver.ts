import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ethers } from "ethers";
import ABIS from "@discovery-dao/hardhat/abis.json";
import { Where } from "@textile/hub";

import { UseCeramicClient, UseThreadDBClient } from "../../../core/utils/types";
import { Quest } from "../Quest.entity";
import { verifyAdventurerClaimInfo } from "../../../core/utils/security/verify";
import { AppService } from "../../../app.service";

import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { UseThreadDB } from "../../../core/decorators/UseThreadDB.decorator";
import { ThreadDBService } from "../../../services/thread-db/thread-db.service";
import { ClaimQuestRewardsInput } from "../dto/ClaimQuestRewards.input";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { ForbiddenError } from "apollo-server-express";

@Resolver(() => Quest)
export class ClaimQuestRewardsResolver {
  constructor(
    public readonly appService: AppService,
    private readonly threadDBService: ThreadDBService
  ) {}

  @Mutation(() => Quest, {
    nullable: true,
    description: "Verify a new Quest right before minting in dCompass",
    name: "claimQuestRewards",
  })
  async claimQuestRewards(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input")
    { questId, did, questAdventurerSignature, chainId }: ClaimQuestRewardsInput
  ): Promise<Quest | null | undefined> {
    const [foundQuest] = await this.threadDBService.query({
      collectionName: "Quest",
      dbClient,
      threadId: latestThreadId,
      query: new Where("_id").eq(questId),
    });
    if (!foundQuest) {
      throw new NotFoundException("Quest not found by back-end");
    }
    const quest = foundQuest as Quest;
    const { pathwayId } = quest;

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
    const isCompleted = quest.completedBy?.includes(did);
    if (!isCompleted) {
      throw new ForbiddenError("Quest not completed yet!");
    }

    const chainIdStr = chainId.toString();
    if (!Object.keys(ABIS).includes(chainIdStr)) {
      throw new Error("Unsupported Network");
    }

    // const pathway = await this.threadDBService.getPathwayById({
    //   dbClient,
    //   threadId: latestThreadId,
    //   pathwayId: quest.pathwayId,
    // });
    // const verifyContract = this.appService.getContract(chainIdStr, 'Verify');
    const questContract = this.appService.getContract(chainIdStr, "BadgeNFT");
    const metadataNonceId = await questContract.nonces(
      quest.streamId,
      decodedAddress
    );
    console.log({ metadataNonceId });
    const { r, s, v } = await verifyAdventurerClaimInfo({
      contractAddress: questContract.address,
      nonceId: metadataNonceId,
      objectId: quest.streamId,
      senderAddress: decodedAddress,
      chainId,
      verifyContract: questContract.address,
    });

    return {
      ...quest,
      id: questId,
      expandedServerSignatures: [{ r, s, v }],
    };
  }
}
