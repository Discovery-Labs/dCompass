import { Resolver, Mutation, Args } from "@nestjs/graphql";
import ABIS from "@discovery-dao/hardhat/abis.json";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

import { Quest } from "../Quest.entity";
import { verifyNFTInfo } from "../../../core/utils/security/verify";
import { AppService } from "../../../app.service";
import { VerifyQuestInput } from "../dto/VerifyQuest.input";
import { QuestService } from "../Quest.service";
import removeNulls from "../../../core/utils/helpers";
import { SiweMessage } from "siwe";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";

@Resolver(() => Quest)
export class VerifyQuestResolver {
  constructor(
    public readonly appService: AppService,
    private readonly questService: QuestService
  ) {}

  @Mutation(() => Quest, {
    nullable: true,
    description: "Verify a new Quest right before minting in dCompass",
    name: "verifyQuest",
  })
  async verifyQuest(
    @UseSiwe() siwe: SiweMessage,
    @Args("input")
    { id, questType }: VerifyQuestInput
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

    const { address, chainId } = siwe;

    const { pathway } = foundQuest;
    if (!pathway) {
      throw new NotFoundException("Quest has no parent pathway");
    }
    const { project } = pathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project");
    }
    // TODO: Keep track of address & network to avoid impersonation
    console.log({ address });
    const projectContributors = project.squads
      ? project.squads.flatMap((squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    if (!projectContributors.includes(address.toLowerCase())) {
      throw new ForbiddenException("Unauthorized");
    }

    const chainIdStr = chainId.toString();
    if (!Object.keys(ABIS).includes(chainIdStr)) {
      throw new Error("Unsupported Network");
    }

    const verifyContract = this.appService.getContract(chainIdStr, "Verify");
    const questContract = this.appService.getContract(chainIdStr, "BadgeNFT");

    const [metadataNonceId, thresholdNonceId] = await Promise.all([
      verifyContract.noncesParentIdChildId(
        pathway.streamId,
        foundQuest.streamId
      ),
      verifyContract.thresholdNoncesById(foundQuest.streamId),
    ]);

    const [metadataVerify, tresholdVerify] = await Promise.all([
      verifyNFTInfo({
        contractAddress: questContract.address,
        nonceId: metadataNonceId,
        objectId: foundQuest.streamId,
        senderAddress: address,
        verifyContract: verifyContract.address,
      }),
      verifyNFTInfo({
        contractAddress: questContract.address,
        nonceId: thresholdNonceId,
        objectId: foundQuest.streamId,
        senderAddress: address,
        verifyContract: verifyContract.address,
        votesNeeded: 1,
      }),
    ]);

    return removeNulls({
      ...foundQuest,
      expandedServerSignatures: [
        { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
        { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
      ],
    });
  }
}
