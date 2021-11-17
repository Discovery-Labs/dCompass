import { TileDocument } from '@ceramicnetwork/stream-tile';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { compareHash } from '../../../core/utils/security/hash';
import { Ceramic } from '../../../core/utils/types';
import { QuestAnswersSubmitionInput } from '../dto/QuestAnswersSubmition.input';
import { Question } from '../dto/Question';

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
    const questDetails = await ceramicClient.ceramic.loadStream(
      answerSubmition.questId,
    );
    if (!questDetails) {
      return false;
    }
    const questions = questDetails.state.content.questions;
    const submittedHashedAnswers = await Promise.all(
      answerSubmition.questionAnswers.map(async (qa) => {
        const rightHashedAnswer = questions.find(
          (question: Question) => question.question === qa.question,
        ).answer;
        const isRight = await compareHash(qa.answer, rightHashedAnswer);
        return isRight;
      }),
    );
    const isSuccess = submittedHashedAnswers.every((result) => result);
    if (isSuccess) {
      const alreadyCompletedBy =
        questDetails.state.next?.content.completedBy ?? [];
      console.log(alreadyCompletedBy);
      // const isAlreadyCompletedByUser = alreadyCompletedBy.some(
      //   (user: string) => user === answerSubmition.did,
      // );
      // if (isAlreadyCompletedByUser) return false;
      const questDoc = await TileDocument.load(
        ceramicClient.ceramic,
        answerSubmition.questId,
      );
      await questDoc.update({
        completedBy:
          alreadyCompletedBy && alreadyCompletedBy.length > 0
            ? new Set([...alreadyCompletedBy, answerSubmition.did])
            : [answerSubmition.did],
      });
    }
    return isSuccess;
  }
}
