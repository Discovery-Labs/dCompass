import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import { ForbiddenError } from 'apollo-server-express';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Quest } from '../Quest.entity';
import { schemaAliases } from '../../../core/constants/idx';
import { CreateQuestInput } from '../dto/CreateQuest.input';

@Resolver(() => Quest)
export class CreateQuestResolver {
  @Mutation(() => Quest, {
    nullable: true,
    description: 'Create a new Quest in dCompass',
    name: 'createQuest',
  })
  async createQuest(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input') { id, questCreatorSignature }: CreateQuestInput,
  ): Promise<Quest | null | undefined> {
    // Check that the current user is the owner of the quest
    const ogQuest = await ceramicClient.ceramic.loadStream(id);
    const pathwayId = ogQuest.content.pathwayId;
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id, pathwayId }),
      questCreatorSignature,
    );

    const ownerAccounts = await ceramicClient.dataStore.get(
      'cryptoAccounts',
      ogQuest.controllers[0],
    );
    if (!ownerAccounts) throw new ForbiddenError('Unauthorized');
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split('@')[0],
    );
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError('Unauthorized');
    }

    const allPathways = await ceramicClient.dataStore.get(
      schemaAliases.PATHWAYS_ALIAS,
    );
    const pathways = allPathways?.pathways ?? [];

    const pathwayIndexedFields = pathways.find(
      (pathway: { id: string }) => pathway.id === pathwayId,
    );
    if (!pathwayIndexedFields) {
      return null;
    }

    console.log({ pathwayIndexedFields });

    // remove previously indexed pathway and recreate it as with the new pending quest
    const existingPathways = pathways.filter(
      (pathway: { id: string }) => pathway.id !== pathwayIndexedFields.id,
    );

    console.log({ existingPathways });
    // Add the new quest for review
    const appPathwaysUpdated = [
      {
        id,
        ...pathwayIndexedFields,
        pendingQuests: [
          ...(pathwayIndexedFields.pendingQuests ?? []),
          ogQuest.id.toUrl(),
        ],
      },
      ...existingPathways,
    ];

    await ceramicClient.dataStore.set(schemaAliases.PATHWAYS_ALIAS, {
      pathways: appPathwaysUpdated,
    });

    return {
      id,
      ...ogQuest.content,
    };
  }
}
