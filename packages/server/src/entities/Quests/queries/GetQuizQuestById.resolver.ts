import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Quest } from '../Quest.entity';
import { QuizQuest } from '../QuizQuest.entity';

@Resolver(() => QuizQuest)
export class GetQuizQuestByIdResolver {
  @Query(() => QuizQuest, {
    nullable: true,
    description: 'Gets a quiz quest by its Stream ID',
    name: 'getQuizQuestById',
  })
  async getQuizQuestById(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('questId') questId: string,
  ): Promise<Quest | null | undefined> {
    const ogQuest = await ceramicClient.ceramic.loadStream(questId);
    if (!ogQuest) {
      throw new NotFoundException('Quest not found!');
    }
    const indexedQuests = await ceramicClient.dataStore.get(
      schemaAliases.QUESTS_ALIAS,
    );
    const allQuests = indexedQuests?.quests ?? [];
    const currentQuest = allQuests.find(
      (quest: { id: string }) => quest.id === ogQuest.id.toUrl(),
    );
    if (!currentQuest) {
      throw new NotFoundException('Quest not found or not approved yet!');
    }
    const parentPathway = await ceramicClient.ceramic.loadStream(
      ogQuest.content.pathwayId,
    );
    return {
      id: ogQuest.id.toUrl(),
      ...ogQuest.content,
      ...currentQuest,
      pathway: {
        id: parentPathway.id.toUrl(),
        ...parentPathway.content,
        quests: parentPathway.content.quests,
      },
    };
  }
}
