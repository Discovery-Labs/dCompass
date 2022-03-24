import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { Pathway } from '../../Pathways/Pathway.entity';

@Resolver(() => Pathway)
export class GetAllQuestsByPathwayIdResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Query(() => Pathway, {
    nullable: true,
    description: 'Gets all the quests in dCompass',
    name: 'getAllQuestsByPathwayId',
  })
  async getAllQuestsByPathwayId(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('pathwayId') pathwayId: string,
  ): Promise<Pathway | null> {
    const [foundPathway] = await this.threadDBService.query({
      collectionName: 'Pathway',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(pathwayId),
    });
    if (!foundPathway) {
      throw new NotFoundException('Pathway not found');
    }
    const { _id, ...pathway } = foundPathway as any;

    const questIds = pathway.quests ?? [];

    const pendingQuestIds = pathway.pendingQuests ?? [];

    const questsWithDetails = await Promise.all(
      questIds.map(async (questId: string) => {
        const [pathway] = await this.threadDBService.query({
          collectionName: 'Quest',
          dbClient,
          threadId: latestThreadId,
          query: new Where('_id').eq(questId),
        });
        return {
          id: (pathway as any)._id,
          isPending: false,
          ...(pathway as any),
        };
      }),
    );
    const pendingQuestsWithDetails = await Promise.all(
      pendingQuestIds.map(async (questId: string) => {
        const [pathway] = await this.threadDBService.query({
          collectionName: 'Quest',
          dbClient,
          threadId: latestThreadId,
          query: new Where('_id').eq(questId),
        });
        return {
          id: (pathway as any)._id,
          isPending: true,
          ...(pathway as any),
        };
      }),
    );

    return {
      id: _id,
      ...pathway,
      quests: [...questsWithDetails, ...pendingQuestsWithDetails].map(
        (quest) => ({
          ...quest,
          questType: quest.type.label,
        }),
      ),
    };
  }
}
