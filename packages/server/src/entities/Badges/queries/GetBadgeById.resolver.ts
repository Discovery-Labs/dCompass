import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';

import { Badge } from '../Badge.entity';

@Resolver(() => Badge)
export class GetBadgeByIdResolver {
  @Query(() => Badge, {
    nullable: true,
    description: 'Gets a badge by its Stream ID',
    name: 'getBadgeById',
  })
  async getBadgeById(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('badgeId') badgeId: string,
  ): Promise<Badge | null | undefined> {
    console.log('BADGE QUERY');
    const record = await ceramicClient.ceramic.loadStream(badgeId);
    if (!record) {
      return null;
    }
    console.log({ record });
    return {
      id: badgeId,
      ...record.state.content,
      // quests: record.state.next?.content.quests,
    };
  }
}
