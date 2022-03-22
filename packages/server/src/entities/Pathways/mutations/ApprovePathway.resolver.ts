import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import { ForbiddenError } from 'apollo-server-express';
import { NotFoundException } from '@nestjs/common';
import { Where } from '@textile/hub';
import ABIS from '@discovery-dao/hardhat/abis.json';

import { UseThreadDBClient } from '../../../core/utils/types';
import { Pathway } from '../Pathway.entity';
import { ApprovePathwayInput } from '../dto/ApprovePathway.input';
import { Squad } from '../../Squads/Squad.entity';
import { verifyNFTInfo } from '../../../core/utils/security/verify';
import { AppService } from '../../../app.service';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';

@Resolver(() => Pathway)
export class ApprovePathwayResolver {
  constructor(
    public readonly appService: AppService,
    private readonly threadDBService: ThreadDBService,
  ) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: 'Approve a new Pathway in dCompass',
    name: 'approvePathway',
  })
  async approvePathway(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input')
    { id, pathwayApproverSignature, chainId }: ApprovePathwayInput,
  ): Promise<Pathway | null | undefined> {
    const [foundPathway] = await this.threadDBService.query({
      collectionName: 'Pathway',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(id),
    });
    if (!foundPathway) {
      throw new NotFoundException('Pathway not found by back-end');
    }
    const pathway = foundPathway as Pathway;
    const { projectId } = pathway;
    const foundProject = await this.threadDBService.getProjectById({
      dbClient,
      threadId: latestThreadId,
      projectId,
    });
    console.log({ foundProject });
    const projectStreamId = foundProject.streamId;
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, projectId }),
      pathwayApproverSignature,
    );
    // TODO: Keep track of address & network to avoid impersonation
    console.log({ decodedAddress });
    const projectContributors = foundProject.squads
      ? foundProject.squads.flatMap((squad: Squad) =>
          squad.members.map((m) => m.toLowerCase()),
        )
      : [];

    if (!projectContributors.includes(decodedAddress.toLowerCase())) {
      throw new ForbiddenError('Unauthorized');
    }

    const existingPathways = foundProject.pathways ?? [];
    // remove previously pending pathway and set it as approved
    const updatedProject = {
      _id: projectId,
      ...foundProject,
      pathways: [...new Set(existingPathways), id],
      pendingPathways: [
        ...new Set(
          foundProject.pendingPathways.filter(
            (pathwayId: string) => pathwayId !== id,
          ),
        ),
      ],
    };

    await this.threadDBService.update({
      collectionName: 'Project',
      dbClient,
      threadId: latestThreadId,
      values: [updatedProject],
    });

    const chaindIdStr = chainId.toString();
    if (!Object.keys(ABIS).includes(chaindIdStr)) {
      throw new Error('Unsupported Network');
    }

    const verifyContract = this.appService.getContract(chaindIdStr, 'Verify');
    const pathwayContract = this.appService.getContract(
      chaindIdStr,
      'PathwayNFT',
    );

    const [metadataNonceId, thresholdNonceId] = await Promise.all([
      verifyContract.noncesParentIdChildId(projectStreamId, pathway.streamId),
      verifyContract.thresholdNoncesById(pathway.streamId),
    ]);

    console.log({ pathwayId: pathway.streamId });
    const [metadataVerify, tresholdVerify] = await Promise.all([
      verifyNFTInfo({
        contractAddress: pathwayContract.address,
        nonceId: metadataNonceId,
        objectId: pathway.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
      }),
      verifyNFTInfo({
        contractAddress: pathwayContract.address,
        nonceId: thresholdNonceId,
        objectId: pathway.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
        votesNeeded: 1,
      }),
    ]);

    return {
      ...pathway,
      id,
      projectStreamId: foundProject.streamId,
      expandedServerSignatures: [
        { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
        { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
      ],
    };
  }
}
