import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import ABIS from '@discovery-dao/hardhat/abis.json';
import { Where } from '@textile/hub';

import { UseCeramicClient, UseThreadDBClient } from '../../../core/utils/types';
import { verifyAdventurerClaimInfo } from '../../../core/utils/security/verify';
import { AppService } from '../../../app.service';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { ForbiddenError } from 'apollo-server-express';
import { Pathway } from '../Pathway.entity';
import { ClaimPathwayRewardsInput } from '../dto/ClaimPathwayRewards.input';
import { Quest } from '../../Quests/Quest.entity';

@Resolver(() => Pathway)
export class ClaimPathwayRewardsResolver {
  constructor(
    public readonly appService: AppService,
    private readonly threadDBService: ThreadDBService,
  ) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: 'Verify a new Pathway right before minting in dCompass',
    name: 'claimPathwayRewards',
  })
  async claimPathwayRewards(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input')
    {
      pathwayId,
      did,
      questAdventurerSignature,
      chainId,
    }: ClaimPathwayRewardsInput,
  ): Promise<Pathway | null | undefined> {
    const [foundPathway] = await this.threadDBService.query({
      collectionName: 'Pathway',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(pathwayId),
    });
    if (!foundPathway) {
      throw new NotFoundException('Pathway not found by back-end');
    }
    const pathway = foundPathway as Pathway;
    const { projectId } = pathway;

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: pathwayId, projectId }),
      questAdventurerSignature,
    );

    if (!decodedAddress) {
      throw new ForbiddenException('Unauthorized');
    }

    // Check that the quest Adventurer is the person he claims to be
    const adventurerAccounts = await ceramicClient.dataStore.get(
      'cryptoAccounts',
      did,
    );
    console.log({ adventurerAccounts, decodedAddress });
    if (!adventurerAccounts) throw new ForbiddenError('Unauthorized');
    const formattedAccounts = Object.keys(adventurerAccounts).map(
      (account) => account.split('@')[0],
    );
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError('Unauthorized');
    }
    if (!pathway.quests?.length) {
      throw new ForbiddenError('No quests yet');
    }
    const questsWithDetails = await Promise.all(
      (pathway as any).quests.map(async (questIdxs: string) => {
        console.log({ questIdxs });
        const {
          _id: qId,
          isPending,
          ...quest
        } = await this.threadDBService.getQuestById({
          questId: questIdxs,
          dbClient,
          threadId: latestThreadId,
        });
        return {
          id: qId,
          ...quest,
          isPending: false,
        };
      }),
    );
    // Check that the user has already completed the quest
    const totalQuestCount = pathway.quests.length;
    const completedQuestCount = questsWithDetails.filter(
      (q: Quest) => q.completedBy && q.completedBy.includes(did),
    ).length;
    const ratio = (completedQuestCount / totalQuestCount) * 100;
    console.log({ totalQuestCount, completedQuestCount, ratio });
    const isCompleted = ratio === 100;
    if (!isCompleted) {
      throw new ForbiddenError('Pathway not completed yet!');
    }

    const chainIdStr = chainId.toString();
    if (!Object.keys(ABIS).includes(chainIdStr)) {
      throw new Error('Unsupported Network');
    }

    // const pathway = await this.threadDBService.getPathwayById({
    //   dbClient,
    //   threadId: latestThreadId,
    //   pathwayId: quest.pathwayId,
    // });
    // const verifyContract = this.appService.getContract(chainIdStr, 'Verify');
    const pathwayContract = this.appService.getContract(
      chainIdStr,
      'PathwayNFT',
    );
    const metadataNonceId = await pathwayContract.nonces(
      pathway.streamId,
      decodedAddress,
    );
    console.log({ metadataNonceId });
    const { r, s, v } = await verifyAdventurerClaimInfo({
      contractAddress: pathwayContract.address,
      nonceId: metadataNonceId,
      objectId: pathway.streamId,
      senderAddress: decodedAddress,
      chainId,
      verifyContract: pathwayContract.address,
    });

    return {
      ...pathway,
      id: pathwayId,
      expandedServerSignatures: [{ r, s, v }],
    };
  }
}
