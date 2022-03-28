import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';
import { NotFoundException } from '@nestjs/common';

import { UseThreadDBClient } from '../../../core/utils/types';
import { Quest } from '../Quest.entity';
import { ApproveQuestInput } from '../dto/ApproveQuest.input';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { ethers } from 'ethers';
import { Squad } from '../../Squads/Squad.entity';
import { ForbiddenError } from 'apollo-server-express';

@Resolver(() => Quest)
export class ApproveQuestResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Mutation(() => Quest, {
    nullable: true,
    description: 'Approve a new Quest in dCompass',
    name: 'approveQuest',
  })
  async approveQuest(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input') { id, questApproverSignature }: ApproveQuestInput,
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
    const quest = foundQuest as any;
    // Check if the current user is a project contributor
    const foundPathway = await this.threadDBService.getPathwayById({
      dbClient,
      threadId: latestThreadId,
      pathwayId: quest.pathwayId,
    });
    const { projectId } = foundPathway;
    const foundProject = await this.threadDBService.getProjectById({
      dbClient,
      threadId: latestThreadId,
      projectId,
    });
    console.log({ foundProject });

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, pathwayId: quest.pathwayId }),
      questApproverSignature,
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

    const existingQuests = foundPathway.quests ?? [];
    // remove previously pending quest and set it as approved
    const updatedPathway = {
      _id: quest.pathwayId,
      ...foundPathway,
      quests: [...new Set(existingQuests), id],
      pendingQuests: [
        ...new Set(
          foundPathway.pendingQuests.filter(
            (questId: string) => questId !== id,
          ),
        ),
      ],
    };

    await this.threadDBService.update({
      collectionName: 'Pathway',
      dbClient,
      threadId: latestThreadId,
      values: [updatedPathway],
    });

    // TODO: Verify metadata et al
    // const chaindIdStr = chainId.toString();
    // if (!Object.keys(ABIS).includes(chaindIdStr)) {
    //   throw new Error('Unsupported Network');
    // }

    // const verifyContract = this.appService.getContract(chaindIdStr, 'Verify');
    // const pathwayContract = this.appService.getContract(
    //   chaindIdStr,
    //   'PathwayNFT',
    // );

    // const [metadataNonceId, thresholdNonceId] = await Promise.all([
    //   verifyContract.noncesParentIdChildId(
    //     projectStreamId,
    //     foundPathway.streamId,
    //   ),
    //   verifyContract.thresholdNoncesById(foundPathway.streamId),
    // ]);

    // console.log({ pathwayId: foundPathway.streamId });
    // const [metadataVerify, tresholdVerify] = await Promise.all([
    //   verifyNFTInfo({
    //     contractAddress: pathwayContract.address,
    //     nonceId: metadataNonceId,
    //     objectId: foundPathway.streamId,
    //     senderAddress: decodedAddress,
    //     verifyContract: verifyContract.address,
    //   }),
    //   verifyNFTInfo({
    //     contractAddress: pathwayContract.address,
    //     nonceId: thresholdNonceId,
    //     objectId: foundPathway.streamId,
    //     senderAddress: decodedAddress,
    //     verifyContract: verifyContract.address,
    //     votesNeeded: 1,
    //   }),
    // ]);

    // return {
    //   ...foundPathway,
    //   id,
    //   projectStreamId: foundProject.streamId,
    //   expandedServerSignatures: [
    //     { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
    //     { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
    //   ],
    // };

    return null;
  }
}
