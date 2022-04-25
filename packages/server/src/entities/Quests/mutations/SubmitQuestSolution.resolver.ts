import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-express';
import { Where } from '@textile/hub';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AppService } from '../../../app.service';
import { ethers } from 'ethers';
import { QuestSolutionSubmissionInput } from '../dto/QuestSolutionSubmission.input';

@Resolver(() => Boolean)
export class SubmitQuestSolutionResolver {
  constructor(
    private readonly threadDBService: ThreadDBService,
    public readonly appService: AppService,
  ) { }
  @Mutation(() => Boolean, {
    nullable: false,
    description: 'Submits quest solution',
    name: 'submitQuestSolution',
  })
  async submitQuestSolution(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input') solutionSubmission: QuestSolutionSubmissionInput,
  ): Promise<boolean> {
    const [foundQuest] = await this.threadDBService.query({
      collectionName: 'Quest',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(solutionSubmission.questId),
    });
    if (!foundQuest) {
      throw new NotFoundException('Quest not found');
    }

    const { _id, ...quest } = foundQuest as any;

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({
        id: solutionSubmission.questId,
        pathwayId: quest.pathwayId,
      }),
      solutionSubmission.questAdventurerSignature,
    );
    console.log({ decodedAddress });
    if (!decodedAddress) {
      throw new ForbiddenException('Unauthorized');
    }

    const alreadySubmittedBy = quest.submissions.map(
      ({ did }: { did: string }) => did,
    );
    const alreadyCompletedBy = quest.completedBy ?? [];
    const isQuestAlreadyCompleted = alreadyCompletedBy.includes(
      solutionSubmission.did,
    );
    const isQuestAlreadySubmitted = alreadySubmittedBy.includes(
      solutionSubmission.did,
    );
    if (isQuestAlreadySubmitted) {
      throw new ForbiddenError('Quest solution already submitted');
    }
    if (isQuestAlreadyCompleted) {
      throw new ForbiddenError('Quest already completed');
    }

    await this.threadDBService.update({
      collectionName: 'Quest',
      dbClient,
      threadId: latestThreadId,
      values: [
        {
          _id,
          ...quest,
          submissions: [
            ...quest.submissions,
            {
              did: solutionSubmission.did,
              solution: solutionSubmission.solution,
              isApproved: false,
            },
          ],
        },
      ],
    });

    return true;
  }
}
