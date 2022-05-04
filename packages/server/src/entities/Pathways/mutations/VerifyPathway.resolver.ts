import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ethers } from "ethers";
import ABIS from "@discovery-dao/hardhat/abis.json";

import { Pathway } from "../Pathway.entity";
import { verifyNFTInfo } from "../../../core/utils/security/verify";
import { AppService } from "../../../app.service";
import { VerifyPathwayInput } from "../dto/VerifyPathway.input";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Squad } from "../../Squads/Squad.entity";

import { PathwayService } from "../Pathway.service";
import removeNulls from "../../../core/utils/helpers";

@Resolver(() => Pathway)
export class VerifyPathwayResolver {
  constructor(
    public readonly appService: AppService,
    private readonly pathwayService: PathwayService
  ) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: "Verify a new Pathway right before minting in dCompass",
    name: "verifyPathway",
  })
  async verifyPathway(
    @Args("input")
    { id, pathwayMinterSignature, chainId }: VerifyPathwayInput
  ): Promise<Pathway | null | undefined> {
    const foundPathway = await this.pathwayService.pathwayWithProjectInfos({
      id,
    });
    if (!foundPathway) {
      throw new NotFoundException("Pathway not found by back-end");
    }
    const { projectId, project } = foundPathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project!");
    }

    const projectStreamId = project.streamId;
    console.log("approving pathway");
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, projectId }),
      pathwayMinterSignature
    );

    if (!decodedAddress) {
      throw new ForbiddenException("Unauthorized");
    }

    const projectContributors = project.squads.flatMap(
      (squad: Squad) => squad.members
    );
    if (!projectContributors.includes(decodedAddress)) {
      throw new ForbiddenException("Unauthorized");
    }
    const chaindIdStr = chainId.toString();
    if (!Object.keys(ABIS).includes(chaindIdStr)) {
      throw new Error("Unsupported Network");
    }

    const verifyContract = this.appService.getContract(chaindIdStr, "Verify");
    const pathwayContract = this.appService.getContract(
      chaindIdStr,
      "PathwayNFT"
    );

    const [metadataNonceId, thresholdNonceId] = await Promise.all([
      verifyContract.noncesParentIdChildId(
        projectStreamId,
        foundPathway.streamId
      ),
      verifyContract.thresholdNoncesById(foundPathway.streamId),
    ]);

    const [metadataVerify, tresholdVerify] = await Promise.all([
      verifyNFTInfo({
        contractAddress: pathwayContract.address,
        nonceId: metadataNonceId,
        objectId: foundPathway.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
      }),
      verifyNFTInfo({
        contractAddress: pathwayContract.address,
        nonceId: thresholdNonceId,
        objectId: foundPathway.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
        votesNeeded: 1,
      }),
    ]);

    return removeNulls({
      ...foundPathway,
      id,
      projectStreamId,
      expandedServerSignatures: [
        { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
        { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
      ],
    });
  }
}
