import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import ABIS from '@discovery-dao/hardhat/abis.json';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Pathway } from '../Pathway.entity';
import { verifyNFTInfo } from '../../../core/utils/security/verify';
import { AppService } from '../../../app.service';
import { VerifyPathwayInput } from '../dto/VerifyPathway.input';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Squad } from '../../Squads/Squad.entity';

@Resolver(() => Pathway)
export class VerifyPathwayResolver {
  constructor(public readonly appService: AppService) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: 'Verify a new Pathway right before minting in dCompass',
    name: 'verifyPathway',
  })
  async verifyPathway(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input')
    { id, pathwayMinterSignature, chainId }: VerifyPathwayInput,
  ): Promise<Pathway | null | undefined> {
    const ogPathway = await ceramicClient.ceramic.loadStream(id);
    if (!ogPathway) {
      throw new NotFoundException('Pathway not found');
    }
    const projectId = ogPathway.content.projectId;
    const ogProject = await ceramicClient.ceramic.loadStream(projectId);
    console.log('approving pathway');
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: ogPathway.id.toUrl(), projectId }),
      pathwayMinterSignature,
    );

    if (!decodedAddress) {
      throw new ForbiddenException('Unauthorized');
    }
    console.log({ decodedAddress });

    const projectContributors = ogProject.content.squads.flatMap(
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
      verifyContract.noncesParentIdChildId(projectId, ogPathway.id.toUrl()),
      verifyContract.thresholdNoncesById(ogPathway.id.toUrl()),
    ]);

    console.log({ pathwayId: ogPathway.id.toUrl() });
    const [metadataVerify, tresholdVerify] = await Promise.all([
      verifyNFTInfo({
        contractAddress: pathwayContract.address,
        nonceId: metadataNonceId,
        objectId: ogPathway.id.toUrl(),
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
      }),
      verifyNFTInfo({
        contractAddress: pathwayContract.address,
        nonceId: thresholdNonceId,
        objectId: ogPathway.id.toUrl(),
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
        votesNeeded: 1,
      }),
    ]);

    return {
      id,
      ...ogPathway.content,
      expandedServerSignatures: [
        { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
        { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
        ,
      ],
    };
  }
}
