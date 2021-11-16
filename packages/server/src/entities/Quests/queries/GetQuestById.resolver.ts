import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseCeramicClient } from '../../../core/decorators/UseCeramicClient.decorator';
import { Ceramic } from '../../../core/utils/types';
import { Quest } from '../Quest.entity';

@Resolver(() => Quest)
export class GetQuestByIdResolver {
  @Query(() => Quest, {
    nullable: true,
    description: 'Gets a quest by its Stream ID',
    name: 'getQuestById',
  })
  async getQuestById(
    @UseCeramicClient() ceramicClient: Ceramic,
    @Args('questId') questId: string,
  ): Promise<Quest | null | undefined> {
    const record = await ceramicClient.ceramic.loadStream(questId);
    if (!record) {
      return null;
    }
    const relatedCourse = await ceramicClient.ceramic.loadStream(
      record.state.content.courseId,
    );
    return {
      id: questId,
      ...record.state.content,
      course: {
        id: relatedCourse.id.toUrl(),
        ...relatedCourse.state.content,
        quests: relatedCourse.state.next?.content.quests,
      },
    };
  }
}
