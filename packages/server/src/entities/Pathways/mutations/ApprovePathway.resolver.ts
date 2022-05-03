import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ethers } from "ethers";
import { ForbiddenError } from "apollo-server-express";

import ABIS from "@discovery-dao/hardhat/abis.json";

import { Pathway } from "../Pathway.entity";
import { ApprovePathwayInput } from "../dto/ApprovePathway.input";

import { verifyNFTInfo } from "../../../core/utils/security/verify";
import { AppService } from "../../../app.service";

import { PathwayService } from "../Pathway.service";
import { NotFoundException } from "@nestjs/common";
import removeNulls from "../../../core/utils/helpers";

@Resolver(() => Pathway)
export class ApprovePathwayResolver {
  constructor(
    public readonly appService: AppService,
    private readonly pathwayService: PathwayService
  ) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: "Approve a new Pathway in dCompass",
    name: "approvePathway",
  })
  async approvePathway(
    @Args("input")
    { id, pathwayApproverSignature, chainId }: ApprovePathwayInput
  ): Promise<Pathway | null | undefined> {
    const foundPathway = await this.pathwayService.pathwayWithProjectInfos({
      id,
    });

    if (!foundPathway) {
      throw new NotFoundException("Pathway not found!");
    }
    const { projectId, project } = foundPathway;

    if (!project) {
      throw new NotFoundException("Pathway has no parent project!");
    }
    const projectStreamId = project.streamId;
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, projectId }),
      pathwayApproverSignature
    );
    // TODO: Keep track of address & network to avoid impersonation
    const projectContributors = project.squads
      ? project.squads.flatMap((squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    if (!projectContributors.includes(decodedAddress.toLowerCase())) {
      throw new ForbiddenError("Unauthorized");
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

    const updatedPathway = await this.pathwayService.updatePathway({
      where: {
        id: foundPathway.id,
      },
      data: {
        isPending: false,
      },
    });

    return removeNulls({
      ...updatedPathway,
      id,
      projectStreamId,
      expandedServerSignatures: [
        { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
        { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
      ],
    });
  }
}
