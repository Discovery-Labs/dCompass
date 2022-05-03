import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ethers } from "ethers";
import ABIS from "@discovery-dao/hardhat/abis.json";
import { Where } from "@textile/hub";

import { UseCeramicClient, UseThreadDBClient } from "../../../core/utils/types";
import { verifyAdventurerClaimInfo } from "../../../core/utils/security/verify";
import { AppService } from "../../../app.service";

import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { UseThreadDB } from "../../../core/decorators/UseThreadDB.decorator";
import { ThreadDBService } from "../../../services/thread-db/thread-db.service";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { ForbiddenError } from "apollo-server-express";
import { Pathway } from "../Pathway.entity";
import { ClaimPathwayRewardsInput } from "../dto/ClaimPathwayRewards.input";
import { Quest } from "../../Quests/Quest.entity";
import { PathwayService } from "../Pathway.service";
import removeNulls from "../../../core/utils/helpers";

@Resolver(() => Pathway)
export class ClaimPathwayRewardsResolver {
  constructor(
    public readonly appService: AppService,
    private readonly pathwayService: PathwayService
  ) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: "Verify a new Pathway right before minting in dCompass",
    name: "claimPathwayRewards",
  })
  async claimPathwayRewards(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input")
    {
      pathwayId,
      did,
      questAdventurerSignature,
      chainId,
    }: ClaimPathwayRewardsInput
  ): Promise<Pathway | null | undefined> {
    const foundPathway =
      await this.pathwayService.pathwayWithQuestsAndProjectInfos({
        id: pathwayId,
      });
    if (!foundPathway) {
      throw new NotFoundException("Pathway not found by back-end");
    }
    const { projectId, project } = foundPathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project!");
    }

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: pathwayId, projectId }),
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
    if (!adventurerAccounts) throw new ForbiddenError("Unauthorized");
    const formattedAccounts = Object.keys(adventurerAccounts).map(
      (account) => account.split("@")[0]
    );
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError("Unauthorized");
    }
    const allQuests = [
      ...foundPathway.quizQuests,
      ...foundPathway.bountyQuests,
    ];
    if (!allQuests?.length) {
      throw new ForbiddenError("No quests yet");
    }

    // Check that the user has already completed the quest
    const totalQuestCount = allQuests.length;
    const completedQuestCount = allQuests.filter(
      (q) => q.completedBy && q.completedBy.includes(did)
    ).length;
    const ratio = (completedQuestCount / totalQuestCount) * 100;
    console.log({ totalQuestCount, completedQuestCount, ratio });
    const isCompleted = ratio === 100;
    if (!isCompleted) {
      throw new ForbiddenError("Pathway not completed yet!");
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
    const pathwayContract = this.appService.getContract(
      chainIdStr,
      "PathwayNFT"
    );
    const metadataNonceId = await pathwayContract.nonces(
      foundPathway.streamId,
      decodedAddress
    );
    console.log({ metadataNonceId });
    const { r, s, v } = await verifyAdventurerClaimInfo({
      contractAddress: pathwayContract.address,
      nonceId: metadataNonceId,
      objectId: foundPathway.streamId,
      senderAddress: decodedAddress,
      chainId,
      verifyContract: pathwayContract.address,
    });

    return removeNulls({
      ...foundPathway,
      id: pathwayId,
      expandedServerSignatures: [{ r, s, v }],
    });
  }
}
