import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
// import { ForbiddenError } from 'apollo-server-express';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { schemaAliases } from '../../../core/constants/idx';
import { CreateQuestInput } from '../dto/CreateQuest.input';
import { SnapshotVoterQuest } from '../SnapshotVoterQuest.entity';
import { ForbiddenError } from 'apollo-server-express';

@Resolver(() => SnapshotVoterQuest)
export class CreateSnapshotVoterQuestResolver {
  @Mutation(() => SnapshotVoterQuest, {
    nullable: true,
    description: 'Create a new Snapshot Voter Quest in dCompass',
    name: 'createSnapshotVoterQuest',
  })
  async createSnapshotVoterQuest(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input') { id, questCreatorSignature }: CreateQuestInput,
  ): Promise<SnapshotVoterQuest | null | undefined> {
    // Check that the current user is the owner of the quest
    const ogQuest = await ceramicClient.ceramic.loadStream(id);
    console.log({ ogQuestCtrl: ogQuest.controllers[0] });
    const badgeId = ogQuest.content.badgeId;
    console.log({ badgeId, id });
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id, badgeId }),
      questCreatorSignature,
    );
    console.log({ decodedAddress });

    const ownerAccounts = await ceramicClient.dataStore.get(
      'cryptoAccounts',
      ogQuest.controllers[0],
    );
    console.log({ ownerAccounts });
    if (!ownerAccounts) throw new ForbiddenError('Unauthorized');
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split('@')[0],
    );
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError('Unauthorized');
    }

    const allBadges = await ceramicClient.dataStore.get(
      schemaAliases.BADGES_ALIAS,
    );
    const badges = allBadges?.badges ?? [];

    const badgeIndexedFields = badges.find(
      (badge: { id: string }) => badge.id === badgeId,
    );
    if (!badgeIndexedFields) {
      return null;
    }

    console.log({ badgeIndexedFields });

    // remove previously indexed badge and recreate it as with the new pending quest
    const existingBadges = badges.filter(
      (badge: { id: string }) => badge.id !== badgeIndexedFields.id,
    );

    console.log({ existingBadges });
    // Add the new quest for review
    const appBadgesUpdated = [
      {
        id,
        ...badgeIndexedFields,
        pendingQuests: [
          ...(badgeIndexedFields.pendingQuests ?? []),
          ogQuest.id.toUrl(),
        ],
      },
      ...existingBadges,
    ];

    await ceramicClient.dataStore.set(schemaAliases.BADGES_ALIAS, {
      badges: appBadgesUpdated,
    });

    return {
      id,
      ...ogQuest.content,
    };
  }
}
