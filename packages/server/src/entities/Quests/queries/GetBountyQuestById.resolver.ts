import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseCeramicClient, UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { BountyQuest } from '../BountyQuest.entity';
import { GetBountyQuestByIdInput } from '../dto/GetBountyQuestById.input';
import { QuizQuest } from '../QuizQuest.entity';

@Resolver(() => QuizQuest)
export class GetBountyQuestByIdResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Query(() => BountyQuest, {
    nullable: true,
    description: 'Gets a quiz quest by its ID',
    name: 'getBountyQuestById',
  })
  async getBountyQuestById(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @UseCeramic() { ceramicCore }: UseCeramicClient,
    @Args('input') { questId, did, signature }: GetBountyQuestByIdInput,
  ): Promise<BountyQuest | null | undefined> {
    const [foundQuest] = await this.threadDBService.query({
      collectionName: 'Quest',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(questId),
    });
    console.log({ foundQuest });
    if (!foundQuest) {
      throw new NotFoundException('Quest not found');
    }
    const { _id, type, ...quest } = foundQuest as any;
    const questInfos = await ceramicCore.ceramic.loadStream(quest.streamId);
    const questCreatorDID = questInfos.controllers[0];
    const questCreatorBasicProfile = await ceramicCore.get(
      'basicProfile',
      questCreatorDID,
    );

    const [foundPathway] = await this.threadDBService.query({
      collectionName: 'Pathway',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(quest.pathwayId),
    });
    if (!foundPathway) {
      throw new NotFoundException('Pathway not found');
    }
    console.log(questInfos.content);
    const { _id: pathwayId, ...pathway } = foundPathway as any;

    // TODO:
    // 1. check if signature matches an address in the crypto accounts of the did provided
    // 2. check if decoded address is in project contributors
    // 3. if is project contributor then decrypt solutions otherwhise keep as is.
    return {
      id: _id,
      ...quest,
      chainId: questInfos.content.chainId,
      namespace: questInfos.content.namespace,
      questType: type.value,
      createdBy: {
        did: questCreatorDID,
        name: questCreatorBasicProfile?.name || '',
      },
      pathway: {
        id: pathwayId,
        ...pathway,
      },
    };
  }
}
