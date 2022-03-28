import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient, UseThreadDBClient } from '../../../core/utils/types';
import { CreateQuestInput } from '../dto/CreateQuest.input';
import { QuizQuest } from '../QuizQuest.entity';
import { ForbiddenError } from 'apollo-server-express';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';

@Resolver(() => QuizQuest)
export class CreateQuizQuestResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}

  @Mutation(() => QuizQuest, {
    nullable: true,
    description: 'Create a new Quiz quest in dCompass',
    name: 'createQuizQuest',
  })
  async createQuizQuest(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @UseThreadDB()
    { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input') { id, questCreatorSignature }: CreateQuestInput,
  ): Promise<QuizQuest | null | undefined> {
    // Check that the current user is the owner of the quest
    const ogQuest = await ceramicClient.ceramic.loadStream(id);
    const pathwayId = ogQuest.content.pathwayId;
    console.log({ pathwayId, id, ogQuest: ogQuest.content });
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id, pathwayId }),
      questCreatorSignature,
    );
    console.log({ decodedAddress, controllers: ogQuest.controllers });

    const ownerAccounts = await ceramicClient.dataStore.get(
      'cryptoAccounts',
      ogQuest.controllers[0],
    );
    console.log({ ownerAccounts });
    if (!ownerAccounts) throw new ForbiddenError('Unauthorized');
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split('@')[0],
    );
    console.log({
      isValid: !formattedAccounts.includes(decodedAddress),
      formattedAccounts,
      decodedAddress,
    });
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError('Unauthorized');
    }

    const [newQuestId] = await this.threadDBService.create({
      collectionName: 'Quest',
      threadId: latestThreadId,
      values: [
        {
          streamId: id,
          ...ogQuest.content,
          isPending: true,
        },
      ],
      dbClient,
    });

    const pathwayDetails = await this.threadDBService.getPathwayById({
      dbClient,
      threadId: latestThreadId,
      pathwayId,
    });

    const existingPendingQuests = pathwayDetails.pendingQuests ?? [];
    await this.threadDBService.update({
      collectionName: 'Pathway',
      dbClient,
      threadId: latestThreadId,
      values: [
        {
          _id: pathwayId,
          ...pathwayDetails,
          pendingQuests: [...existingPendingQuests, newQuestId],
        },
      ],
    });

    return {
      id: newQuestId,
      streamId: id,
      ...ogQuest.content,
    };
  }
}
