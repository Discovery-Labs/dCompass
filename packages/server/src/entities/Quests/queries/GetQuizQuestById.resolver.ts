import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { Quest } from '../Quest.entity';
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
    @Args('questId') questId: string,
  ): Promise<Quest | null | undefined> {
    const [foundQuest] = await this.threadDBService.query({
      collectionName: 'Quest',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(questId),
    });
    if (!foundQuest) {
      throw new NotFoundException('Quest not found');
    }
    const { _id, ...quest } = foundQuest as any;

    const [foundPathway] = await this.threadDBService.query({
      collectionName: 'Pathway',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(quest.pathwayId),
    });
    if (!foundPathway) {
      throw new NotFoundException('Pathway not found');
    }
    const { _id: pathwayId, ...pathway } = foundPathway as any;
    return {
      id: _id,
      ...quest,
      pathway: {
        id: pathwayId,
        ...pathway,
      },
    };
  }
}
