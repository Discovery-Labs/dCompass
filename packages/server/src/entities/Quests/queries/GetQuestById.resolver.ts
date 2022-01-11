import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Quest } from '../Quest.entity';

@Resolver(() => Quest)
export class GetQuestByIdResolver {
  @Query(() => Quest, {
    nullable: true,
    description: 'Gets a quest by its Stream ID',
    name: 'getQuestById',
  })
  async getQuestById(
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
