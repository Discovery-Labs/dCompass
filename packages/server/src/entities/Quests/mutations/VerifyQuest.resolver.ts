import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import ABIS from '@discovery-dao/hardhat/abis.json';
import { Where } from '@textile/hub';

import { UseThreadDBClient } from '../../../core/utils/types';
import { Quest } from '../Quest.entity';
import { verifyNFTInfo } from '../../../core/utils/security/verify';
import { AppService } from '../../../app.service';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Squad } from '../../Squads/Squad.entity';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { VerifyQuestInput } from '../dto/VerifyQuest.input';

@Resolver(() => Quest)
export class VerifyQuestResolver {
  constructor(
    public readonly appService: AppService,
    private readonly threadDBService: ThreadDBService,
  ) {}

  @Mutation(() => Quest, {
    nullable: true,
    description: 'Verify a new Quest right before minting in dCompass',
    name: 'verifyQuest',
  })
  async verifyQuest(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input')
    { id, questMinterSignature, chainId }: VerifyQuestInput,
  ): Promise<Quest | null | undefined> {
    const [foundQuest] = await this.threadDBService.query({
      collectionName: 'Quest',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(id),
    });
    if (!foundQuest) {
      throw new NotFoundException('Quest not found by back-end');
    }
    const quest = foundQuest as Quest;
    const { pathwayId } = quest;
    const foundPathway = await this.threadDBService.getPathwayById({
      dbClient,
      threadId: latestThreadId,
      pathwayId,
    });

    const { projectId } = foundPathway;
    const foundProject = await this.threadDBService.getProjectById({
      dbClient,
      threadId: latestThreadId,
      projectId,
    });

    const pathwayStreamId = foundPathway.streamId;
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, pathwayId }),
      questMinterSignature,
    );

    if (!decodedAddress) {
      throw new ForbiddenException('Unauthorized');
    }

    const projectContributors = foundProject.squads.flatMap(
      (squad: Squad) => squad.members,
    );
    if (!projectContributors.includes(decodedAddress)) {
      throw new ForbiddenException('Unauthorized');
    }
    const chainIdStr = chainId.toString();
    if (!Object.keys(ABIS).includes(chainIdStr)) {
      throw new Error('Unsupported Network');
    }

    const verifyContract = this.appService.getContract(chainIdStr, 'Verify');
    const questContract = this.appService.getContract(chainIdStr, 'BadgeNFT');

    const [metadataNonceId, thresholdNonceId] = await Promise.all([
      verifyContract.noncesParentIdChildId(pathwayStreamId, quest.streamId),
      verifyContract.thresholdNoncesById(quest.streamId),
    ]);

    console.log({ questId: quest.streamId });
    const [metadataVerify, tresholdVerify] = await Promise.all([
      verifyNFTInfo({
        contractAddress: questContract.address,
        nonceId: metadataNonceId,
        objectId: quest.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
      }),
      verifyNFTInfo({
        contractAddress: questContract.address,
        nonceId: thresholdNonceId,
        objectId: quest.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
        votesNeeded: 1,
      }),
    ]);

    return {
      ...quest,
      id,
      expandedServerSignatures: [
        { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
        { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
      ],
    };
  }
}
