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
    // Check that the current user is the owner of the badge
    const ogQuest = await ceramicClient.ceramic.loadStream(id);
    const badgeId = ogQuest.content.badgeId;
    console.log(ogQuest.content);
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, badgeId }),
      questApproverSignature,
    );

    console.log({ decodedAddress });

    const allBadges = await ceramicClient.dataStore.get(
      schemaAliases.BADGES_ALIAS,
    );
    const badges = allBadges?.badges ?? [];
    const ogBadge = await ceramicClient.ceramic.loadStream(badgeId);

    const additionalFields = badges.find(
      (badge: { id: string }) => badge.id === badgeId,
    );

    if (!ogBadge || !additionalFields) {
      throw new NotFoundException('Badge not found');
    }

    const badgeIndexedFields = {
      ...ogBadge.content,
      ...additionalFields,
    };

    console.log({ badgeIndexedFields });

    // TODO: check if address is part of project contributors
    // const badgeContributors = badgeIndexedFields.squads
    //   ? badgeIndexedFields.squads.flatMap((squad: Squad) =>
    //       squad.members.map((m) => m.toLowerCase()),
    //     )
    //   : [];

    // if (
    //   !badgeIndexedFields ||
    //   !badgeContributors.includes(decodedAddress.toLowerCase())
    // ) {
    //   throw new ForbiddenError('Unauthorized');
    // }

    // remove previously indexed badge and recreate it as with the new pending quest
    const existingBadges = badges.filter(
      (badge: { id: string }) => badge.id !== badgeIndexedFields.id,
    );

    // Approve quest and remove it from the pending quests
    const appBadgesUpdated = [
      ...existingBadges,
      {
        id: badgeId,
        ...badgeIndexedFields,
        // add quest in approved quests
        quests: [...(badgeIndexedFields.quests ?? []), ogQuest.id.toUrl()],
        // remove quest from pending quests
        pendingQuests: [
          ...(badgeIndexedFields.pendingQuests
            ? badgeIndexedFields.pendingQuests.filter(
                (quest: string) => quest !== ogQuest.id.toUrl(),
              )
            : []),
        ],
      },
    ];

    await ceramicClient.dataStore.set(schemaAliases.BADGES_ALIAS, {
      badges: appBadgesUpdated,
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
