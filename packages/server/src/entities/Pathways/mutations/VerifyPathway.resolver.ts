import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import ABIS from '@discovery-dao/hardhat/abis.json';
import { Where } from '@textile/hub';

import { UseThreadDBClient } from '../../../core/utils/types';
import { Pathway } from '../Pathway.entity';
import { verifyNFTInfo } from '../../../core/utils/security/verify';
import { AppService } from '../../../app.service';
import { VerifyPathwayInput } from '../dto/VerifyPathway.input';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Squad } from '../../Squads/Squad.entity';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';

@Resolver(() => Pathway)
export class VerifyPathwayResolver {
  constructor(
    public readonly appService: AppService,
    private readonly threadDBService: ThreadDBService,
  ) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: 'Verify a new Pathway right before minting in dCompass',
    name: 'verifyPathway',
  })
  async verifyPathway(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input')
    { id, pathwayMinterSignature, chainId }: VerifyPathwayInput,
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
    console.log('approving pathway');
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, projectId }),
      pathwayMinterSignature,
    );

    if (!decodedAddress) {
      throw new ForbiddenException('Unauthorized');
    }
    console.log({ decodedAddress });

    const projectContributors = foundProject.squads.flatMap(
      (squad: Squad) => squad.members,
    );
    if (!projectContributors.includes(decodedAddress)) {
      throw new ForbiddenException('Unauthorized');
    }
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
      projectStreamId,
      expandedServerSignatures: [
        { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
        { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
      ],
    };
  }
}
