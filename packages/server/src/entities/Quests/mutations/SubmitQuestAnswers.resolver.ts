import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-express';
import { Where } from '@textile/hub';
import ABIS from '@discovery-dao/hardhat/abis.json';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseCeramicClient, UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { QuestAnswersSubmitionInput } from '../dto/QuestAnswersSubmition.input';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SubmitQuestAnswersOutput } from '../dto/SubmitQuestAnswers.output';
import { AppService } from '../../../app.service';
import { verifyNFTInfo } from '../../../core/utils/security/verify';
import { ethers } from 'ethers';

@Resolver(() => SubmitQuestAnswersOutput)
export class SubmitQuestAnswersResolver {
  constructor(
    private readonly threadDBService: ThreadDBService,
    public readonly appService: AppService,
  ) { }
  @Mutation(() => SubmitQuestAnswersOutput, {
    nullable: false,
    description: 'Submits quest answers',
    name: 'submitQuestAnswers',
  })
  async submitQuestAnswers(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input') answerSubmition: QuestAnswersSubmitionInput,
  ): Promise<SubmitQuestAnswersOutput> {
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

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({
        id: answerSubmition.questId,
        pathwayId: quest.pathwayId,
      }),
      answerSubmition.questAdventurerSignature,
    );
    console.log({ decodedAddress });
    if (!decodedAddress) {
      throw new ForbiddenException('Unauthorized');
    }
    console.log({ quest });
    const decryptedQuestionAnswers = await Promise.all(
      quest.questions.map(
        async (qa: { question: string; choices: string[]; answer: string }) => {
          const decryptedAnswers =
            await ceramicClient.ceramic.did?.decryptDagJWE(
              JSON.parse(qa.answer),
            );

          console.log({ decryptedAnswers });
          const submittedAnswer = answerSubmition.questionAnswers.find(
            (question) => question.question === qa.question,
          )?.answer;
          console.log({ submittedAnswer });

          if (!submittedAnswer || !decryptedAnswers) {
            return false;
          }

          const isCorrect = decryptedAnswers.every((answer: string) =>
            submittedAnswer.includes(answer),
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
      const chainIdStr = answerSubmition.chainId.toString();
      if (!Object.keys(ABIS).includes(chainIdStr)) {
        throw new Error('Unsupported Network');
      }
      const pathway = await this.threadDBService.getPathwayById({
        dbClient,
        threadId: latestThreadId,
        pathwayId: quest.pathwayId,
      });
      const verifyContract = this.appService.getContract(chainIdStr, 'Verify');
      const questContract = this.appService.getContract(chainIdStr, 'BadgeNFT');
      const metadataNonceId = await verifyContract.noncesParentIdChildId(
        pathway.streamId,
        quest.streamId,
      );
      const { r, s, v } = await verifyNFTInfo({
        contractAddress: questContract.address,
        nonceId: metadataNonceId,
        objectId: quest.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
      });
      return {
        isSuccess,
        id: _id,
        ...quest,
        expandedServerSignatures: [{ r, s, v }],
      };
    }
    return {
      isSuccess,
      id: _id,
      ...quest,
    };
  }
}
