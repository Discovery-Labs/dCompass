import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Badge } from '../../Badges/Badge.entity';
import { Quest } from '../Quest.entity';

@Resolver(() => [Quest])
export class GetAllQuestsByBadgeIdResolver {
  @Query(() => [Quest], {
    nullable: true,
    description: 'Gets all the quests in dCompass',
    name: 'getAllQuestsByBadgeId',
  })
  async getAllQuestsByBadgeId(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('badgeId') badgeId: string,
  ): Promise<Quest[] | null> {
    const allBadges = await ceramicClient.dataStore.get(
      schemaAliases.BADGES_ALIAS,
    );
    const badges = allBadges?.badges ?? [];
    console.log(badges);
    const foundBadge = badges.find((badge: Badge) => badge.id === badgeId);

    console.log({ foundBadge });
    if (!foundBadge) {
      throw new NotFoundException('Badge not found');
    }
    const questIds = foundBadge.quests
      ? foundBadge.quests.map((id: string) => ({
          streamId: id,
        }))
      : [];

    const pendingQuestIds = foundBadge.pendingQuests
      ? foundBadge.pendingQuests.map((id: string) => ({
          streamId: id,
        }))
      : [];

    console.log({ questIds });

    const [questsWithDetails, pendingQuestsWithDetails] = await Promise.all([
      ceramicClient.ceramic.multiQuery(questIds),
      ceramicClient.ceramic.multiQuery(pendingQuestIds),
    ]);

    console.log({ questsWithDetails, pendingQuestsWithDetails });

    const serializedQuests = Object.values(questsWithDetails).map((stream) => {
      return {
        id: stream.id.toUrl(),
        ...stream.state.content,
        isPending: false,
      };
    });

    const serializedPendingQuests = Object.values(pendingQuestsWithDetails).map(
      (stream) => {
        return {
          id: stream.id.toUrl(),
          ...stream.state.content,
          isPending: true,
        };
      },
    );
    console.log({ serializedQuests, serializedPendingQuests });
    return [...serializedQuests, ...serializedPendingQuests];
  }
}
