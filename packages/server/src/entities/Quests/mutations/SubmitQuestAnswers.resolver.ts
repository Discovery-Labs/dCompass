import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ForbiddenError } from "apollo-server-express";
import ABIS from "@discovery-dao/hardhat/abis.json";

import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";

import { UseCeramicClient } from "../../../core/utils/types";

import { QuestAnswersSubmitionInput } from "../dto/QuestAnswersSubmition.input";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { SubmitQuestAnswersOutput } from "../dto/SubmitQuestAnswers.output";
import { AppService } from "../../../app.service";
import { verifyNFTInfo } from "../../../core/utils/security/verify";
import { ethers } from "ethers";
import { QuestService } from "../Quest.service";
import removeNulls from "../../../core/utils/helpers";

@Resolver(() => SubmitQuestAnswersOutput)
export class SubmitQuestAnswersResolver {
  constructor(
    private readonly questService: QuestService,
    public readonly appService: AppService
  ) {}
  @Mutation(() => SubmitQuestAnswersOutput, {
    nullable: false,
    description: "Submits quest answers",
    name: "submitQuestAnswers",
  })
  async submitQuestAnswers(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input") answerSubmition: QuestAnswersSubmitionInput
  ): Promise<SubmitQuestAnswersOutput> {
    const foundQuest =
      await this.questService.quizQuestWithPathwayAndProjectSquads({
        id: answerSubmition.questId,
      });
    if (!foundQuest) {
      throw new NotFoundException("Quest not found");
    }

    const { pathway } = foundQuest;
    if (!pathway) {
      throw new NotFoundException("Quest has no parent pathway");
    }
    const { project } = pathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project");
    }

    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({
        id: answerSubmition.questId,
        pathwayId: foundQuest.pathwayId,
      }),
      answerSubmition.questAdventurerSignature
    );
    console.log({ decodedAddress });
    if (!decodedAddress) {
      throw new ForbiddenException("Unauthorized");
    }
    console.log({ foundQuest });
    const decryptedQuestionAnswers = await Promise.all(
      foundQuest.questions.map(
        async (qa: { question: string; choices: string[]; answer: string }) => {
          const decryptedAnswers =
            await ceramicClient.ceramic.did?.decryptDagJWE(
              JSON.parse(qa.answer)
            );

          console.log({ decryptedAnswers });
          const submittedAnswer = answerSubmition.questionAnswers.find(
            (question) => question.question === qa.question
          )?.answer;
          console.log({ submittedAnswer });

          if (!submittedAnswer || !decryptedAnswers) {
            return false;
          }

          const isCorrect = decryptedAnswers.every((answer: string) =>
            submittedAnswer.includes(answer)
          );
          return isCorrect;
        }
      )
    );
    const isSuccess = decryptedQuestionAnswers.every(
      (answerIsCorrect) => answerIsCorrect
    );
    console.log({ isSuccess });

    // TODO: require signature
    if (isSuccess) {
      const alreadyCompletedBy = foundQuest.completedBy ?? [];
      const isQuestAlreadyCompleted = alreadyCompletedBy.includes(
        answerSubmition.did
      );
      console.log({ isQuestAlreadyCompleted });
      if (isQuestAlreadyCompleted) {
        throw new ForbiddenError("Quest already completed");
      }

      await this.questService.updateQuizQuest({
        where: {
          id: foundQuest.id,
        },
        data: {
          completedBy: [...alreadyCompletedBy, answerSubmition.did],
        },
      });
      const chainIdStr = answerSubmition.chainId.toString();
      if (!Object.keys(ABIS).includes(chainIdStr)) {
        throw new Error("Unsupported Network");
      }

      const verifyContract = this.appService.getContract(chainIdStr, "Verify");
      const questContract = this.appService.getContract(chainIdStr, "BadgeNFT");
      const metadataNonceId = await verifyContract.noncesParentIdChildId(
        pathway.streamId,
        foundQuest.streamId
      );
      const { r, s, v } = await verifyNFTInfo({
        contractAddress: questContract.address,
        nonceId: metadataNonceId,
        objectId: foundQuest.streamId,
        senderAddress: decodedAddress,
        verifyContract: verifyContract.address,
      });
      return removeNulls({
        isSuccess,
        ...foundQuest,
        expandedServerSignatures: [{ r, s, v }],
      });
    }
    return removeNulls({
      isSuccess,
      ...foundQuest,
    });
  }
}
