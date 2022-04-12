import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseCeramicClient, UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { QuizQuest } from '../QuizQuest.entity';

@Resolver(() => QuizQuest)
export class GetQuizQuestByIdResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Query(() => QuizQuest, {
    nullable: true,
    description: 'Gets a quiz quest by its ID',
    name: 'getQuizQuestById',
  })
  async getQuizQuestById(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @UseCeramic() { ceramicCore }: UseCeramicClient,
    @Args('questId') questId: string,
  ): Promise<QuizQuest | null | undefined> {
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
