import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Pathway } from '../../Pathways/Pathway.entity';
import { Quest } from '../Quest.entity';

@Resolver(() => [Quest])
export class GetAllQuestsByPathwayIdResolver {
  @Query(() => [Quest], {
    nullable: true,
    description: 'Gets all the quests in dCompass',
    name: 'getAllQuestsByPathwayId',
  })
  async getAllQuestsByPathwayId(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('pathwayId') pathwayId: string,
  ): Promise<Quest[] | null> {
    const allPathways = await ceramicClient.dataStore.get(
      schemaAliases.PATHWAYS_ALIAS,
    );
    const pathways = allPathways?.pathways ?? [];
    const foundPathway = pathways.find(
      (pathway: Pathway) => pathway.id === pathwayId,
    );

    console.log({ foundPathway });
    if (!foundPathway) {
      throw new NotFoundException('Pathway not found');
    }
    const questIds = foundPathway.quests
      ? foundPathway.quests.map((id: string) => ({
          streamId: id,
        }))
      : [];

    const pendingQuestIds = foundPathway.pendingQuests
      ? foundPathway.pendingQuests.map((id: string) => ({
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
    console.log({
      serializedQuests: serializedQuests.map((quest) => ({
        ...quest,
        questType: quest.type.label,
      })),
      serializedPendingQuests: serializedPendingQuests.map((quest) => ({
        ...quest,
        questType: quest.type.label,
      })),
    });
    return [
      ...serializedQuests.map((quest) => ({
        ...quest,
        questType: quest.type.label,
      })),
      ...serializedPendingQuests.map((quest) => ({
        ...quest,
        questType: quest.type.label,
      })),
    ];
  }
}
