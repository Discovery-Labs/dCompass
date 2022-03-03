import { Resolver, Query, Args } from '@nestjs/graphql';
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
    const record = await ceramicClient.ceramic.loadStream(questId);
    if (!record) {
      return null;
    }
    const relatedPathway = await ceramicClient.ceramic.loadStream(
      record.state.content.pathwayId,
    );
    return {
      id: questId,
      ...record.state.content,
      pathway: {
        id: relatedPathway.id.toUrl(),
        ...relatedPathway.state.content,
        quests: relatedPathway.state.next?.content.quests,
      },
    };
  }
}
