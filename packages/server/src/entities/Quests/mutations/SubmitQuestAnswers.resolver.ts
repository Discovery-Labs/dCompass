import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-express';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { QuestAnswersSubmitionInput } from '../dto/QuestAnswersSubmition.input';
// import { Question } from '../dto/Question';

@Resolver(() => Boolean)
export class SubmitQuestAnswersResolver {
  @Mutation(() => Boolean, {
    nullable: false,
    description: 'Submits quest answers',
    name: 'submitQuestAnswers',
  })
  async submitQuestAnswers(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input') answerSubmition: QuestAnswersSubmitionInput,
  ): Promise<boolean> {
    const ogQuest = await ceramicClient.ceramic.loadStream(
      answerSubmition.questId,
    );
    if (!ogQuest) {
      return false;
    }
    const questionAnswers = ogQuest.content.questions;

    const decryptedQuestionAnswers = await Promise.all(
      questionAnswers.map(
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
    const isSuccess = decryptedQuestionAnswers.every((result) => result);
    console.log({ isSuccess });
    if (isSuccess) {
      const previousQuests = await ceramicClient.dataStore.get(
        schemaAliases.QUESTS_ALIAS,
      );
      const allQuests = previousQuests?.quests ?? [];
      // console.log({ allQuests });
      const currentQuest = allQuests.find(
        (quest: { id: string }) =>
          quest.id === `ceramic://${answerSubmition.questId}`,
      );
      console.log({ currentQuest });
      if (!currentQuest) {
        return false;
      }

      const isQuestAlreadyCompleted =
        !!currentQuest.completedBy &&
        currentQuest.completedBy.includes(answerSubmition.did);
      console.log({ isQuestAlreadyCompleted });
      if (isQuestAlreadyCompleted) {
        throw new ForbiddenError('Quest already completed');
      }
      const questsWithoutCurrent = allQuests.filter(
        (quest: { id: string }) =>
          quest.id !== `ceramic://${answerSubmition.questId}`,
      );

      console.log({ questsWithoutCurrent });
      await ceramicClient.dataStore.set(schemaAliases.QUESTS_ALIAS, {
        quests: [
          ...questsWithoutCurrent,
          {
            id: ogQuest.id.toUrl(),
            ...ogQuest.content,
            ...currentQuest,
            completedBy:
              currentQuest.completedBy && currentQuest.completedBy.length > 0
                ? [...currentQuest.completedBy, answerSubmition.did]
                : [answerSubmition.did],
          },
        ],
      });
    }
    return isSuccess;
  }
}
