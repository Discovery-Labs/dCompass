import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { NotFoundException } from "@nestjs/common";
import ABIS from "@discovery-dao/hardhat/abis.json";

import { Quest } from "../Quest.entity";
import { verifyNFTInfo } from "../../../core/utils/security/verify";
import { ApproveQuestInput } from "../dto/ApproveQuest.input";

import { ethers } from "ethers";

import { ForbiddenError } from "apollo-server-express";
import { AppService } from "../../../app.service";
import { QuestService } from "../Quest.service";
import removeNulls from "../../../core/utils/helpers";

@Resolver(() => Quest)
export class ApproveQuestResolver {
  constructor(
    private readonly questService: QuestService,
    public readonly appService: AppService
  ) {}
  @Mutation(() => Quest, {
    nullable: true,
    description: "Approve a new Quest in dCompass",
    name: "approveQuest",
  })
  async approveQuest(
    @Args("input")
    { id, questApproverSignature, chainId, questType }: ApproveQuestInput
  ): Promise<Quest | null | undefined> {
    let foundQuest = null;
    if (questType === "quiz") {
      foundQuest = await this.questService.quizQuestWithPathwayAndProjectSquads(
        {
          id: id,
        }
      );
    }
    if (questType === "bounty") {
      foundQuest =
        await this.questService.bountyQuestWithPathwayAndProjectSquads({
          id: id,
        });
    }

    if (!foundQuest) {
      throw new NotFoundException("Quest not found by back-end");
    }

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, pathwayId: foundQuest.pathwayId }),
      questApproverSignature
    );

    const { pathway } = foundQuest;
    if (!pathway) {
      throw new NotFoundException("Quest has no parent pathway");
    }
    const { project } = pathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project");
    }
    // TODO: Keep track of address & network to avoid impersonation
    console.log({ decodedAddress });
    const projectContributors = project.squads
      ? project.squads.flatMap((squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    if (!projectContributors.includes(decodedAddress.toLowerCase())) {
      throw new ForbiddenError("Unauthorized");
    }

    let updatedQuest = null;
    if (questType === "quiz") {
      updatedQuest = await this.questService.updateQuizQuest({
        where: {
          id: foundQuest.id,
        },
        data: {
          isPending: false,
        },
      });
    }
    if (questType === "bounty") {
      updatedQuest = await this.questService.updateBountyQuest({
        where: {
          id: foundQuest.id,
        },
        data: {
          isPending: false,
        },
      });
    }
    // set it previously pending quest as approved

    const chaindIdStr = chainId.toString();
    if (!Object.keys(ABIS).includes(chaindIdStr)) {
      throw new Error("Unsupported Network");
    }

    const verifyContract = this.appService.getContract(chaindIdStr, "Verify");
    const badgeNFTContract = this.appService.getContract(
      chaindIdStr,
      "BadgeNFT"
    );

    const [metadataNonceId, thresholdNonceId] = await Promise.all([
      verifyContract.noncesParentIdChildId(
        pathway.streamId,
        foundQuest.streamId
      ),
      verifyContract.thresholdNoncesById(foundQuest.streamId),
    ]);
    console.log({ bNFTAdr: badgeNFTContract.address });
    // console.log({ pathwayId: foundPathway.streamId });
    const [metadataVerify, tresholdVerify] = await Promise.all([
      verifyNFTInfo({
        contractAddress: badgeNFTContract.address,
        nonceId: metadataNonceId,
        objectId: foundQuest.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
      }),
      verifyNFTInfo({
        contractAddress: badgeNFTContract.address,
        nonceId: thresholdNonceId,
        objectId: foundQuest.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
        votesNeeded: 1,
      }),
    ]);

    return removeNulls({
      ...updatedQuest,
      expandedServerSignatures: [
        { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
        { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
      ],
    });
  }
}
