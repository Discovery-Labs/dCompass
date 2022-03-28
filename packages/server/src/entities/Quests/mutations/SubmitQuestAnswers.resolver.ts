import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-express';
import { Where } from '@textile/hub';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseCeramicClient, UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { QuestAnswersSubmitionInput } from '../dto/QuestAnswersSubmition.input';
import { NotFoundException } from '@nestjs/common';
// import { Question } from '../dto/Question';

@Resolver(() => Boolean)
export class SubmitQuestAnswersResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Mutation(() => Boolean, {
    nullable: false,
    description: 'Submits quest answers',
    name: 'submitQuestAnswers',
  })
  async submitQuestAnswers(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input') answerSubmition: QuestAnswersSubmitionInput,
  ): Promise<boolean> {
    const [foundQuest] = await this.threadDBService.query({
      collectionName: 'Quest',
      dbClient,
      threadId: latestThreadId,
      query: new Where('_id').eq(answerSubmition.questId),
    });
    if (!foundQuest) {
      throw new NotFoundException('Quest not found');
    }
    const { _id, ...quest } = foundQuest as any;
    console.log({ quest });
    const decryptedQuestionAnswers = await Promise.all(
      quest.questions.map(
        async (qa: { question: string; choices: string[]; answer: string }) => {
          const decryptedAnswers =
            await ceramicClient.ceramic.did?.decryptDagJWE(
              JSON.parse(qa.answer),
            );
          const submittedAnswer = answerSubmition.questionAnswers.find(
            (question) => question.question === qa.question,
          )?.answer;
          if (!submittedAnswer || !decryptedAnswers) {
            return false;
          }

          // TODO: change the radio button on the front-end to send an array for answers
          const answers = [submittedAnswer];
          const isCorrect = Object.values(decryptedAnswers).every((answer) =>
            answers.includes(answer),
          );
          return isCorrect;
        },
      ),
    );
    const isSuccess = decryptedQuestionAnswers.every(
      (answerIsCorrect) => answerIsCorrect,
    );
    console.log({ isSuccess });

    // TODO: require signature
    if (isSuccess) {
      const alreadyCompletedBy = quest.completedBy ?? [];
      const isQuestAlreadyCompleted = alreadyCompletedBy.includes(
        answerSubmition.did,
      );
      console.log({ isQuestAlreadyCompleted });
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
            completedBy: [...alreadyCompletedBy, answerSubmition.did],
          },
        ],
      });
    }
    return isSuccess;
  }
}
