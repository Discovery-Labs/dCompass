import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
// import { ForbiddenError } from 'apollo-server-express';
// import { Squad } from '../../Squads/Squad.entity';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Quest } from '../Quest.entity';
import { schemaAliases } from '../../../core/constants/idx';
import { NotFoundException } from '@nestjs/common';
import { ApproveQuestInput } from '../dto/ApproveQuest.input';

@Resolver(() => Quest)
export class ApproveQuestResolver {
  @Mutation(() => Quest, {
    nullable: true,
    description: 'Approve a new Quest in dCompass',
    name: 'approveQuest',
  })
  async approveQuest(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input') { id, questApproverSignature }: ApproveQuestInput,
  ): Promise<Quest | null | undefined> {
    // Check that the current user is the owner of the pathway
    const ogQuest = await ceramicClient.ceramic.loadStream(id);
    const pathwayId = ogQuest.content.pathwayId;
    console.log(ogQuest.content);
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, pathwayId }),
      questApproverSignature,
    );

    console.log({ decodedAddress });

    const allPathways = await ceramicClient.dataStore.get(
      schemaAliases.PATHWAYS_ALIAS,
    );
    const pathways = allPathways?.pathways ?? [];
    const ogPathway = await ceramicClient.ceramic.loadStream(pathwayId);

    const additionalFields = pathways.find(
      (pathway: { id: string }) => pathway.id === pathwayId,
    );

    if (!ogPathway || !additionalFields) {
      throw new NotFoundException('Pathway not found');
    }

    const pathwayIndexedFields = {
      ...ogPathway.content,
      ...additionalFields,
    };

    console.log({ pathwayIndexedFields });

    // TODO: check if address is part of project contributors
    // const pathwayContributors = pathwayIndexedFields.squads
    //   ? pathwayIndexedFields.squads.flatMap((squad: Squad) =>
    //       squad.members.map((m) => m.toLowerCase()),
    //     )
    //   : [];

    // if (
    //   !pathwayIndexedFields ||
    //   !pathwayContributors.includes(decodedAddress.toLowerCase())
    // ) {
    //   throw new ForbiddenError('Unauthorized');
    // }

    // remove previously indexed pathway and recreate it as with the new pending quest
    const existingPathways = pathways.filter(
      (pathway: { id: string }) => pathway.id !== pathwayIndexedFields.id,
    );

    // Approve quest and remove it from the pending quests
    const appPathwaysUpdated = [
      ...existingPathways,
      {
        id: pathwayId,
        ...pathwayIndexedFields,
        // add quest in approved quests
        quests: [...(pathwayIndexedFields.quests ?? []), ogQuest.id.toUrl()],
        // remove quest from pending quests
        pendingQuests: [
          ...(pathwayIndexedFields.pendingQuests
            ? pathwayIndexedFields.pendingQuests.filter(
                (quest: string) => quest !== ogQuest.id.toUrl(),
              )
            : []),
        ],
      },
    ];

    await ceramicClient.dataStore.set(schemaAliases.PATHWAYS_ALIAS, {
      pathways: appPathwaysUpdated,
    });

    const previousQuests = await ceramicClient.dataStore.get(
      schemaAliases.QUESTS_ALIAS,
    );
    const allQuests = previousQuests?.quests ?? [];
    await ceramicClient.dataStore.set(schemaAliases.QUESTS_ALIAS, {
      quests: [
        ...allQuests,
        {
          id: ogQuest.id.toUrl(),
          ...ogQuest.content,
        },
      ],
    });
    return {
      id,
      ...ogQuest.content,
    };
  }
}
