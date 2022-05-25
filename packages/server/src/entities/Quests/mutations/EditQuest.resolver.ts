import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { NotFoundException } from "@nestjs/common";

import { Quest } from "../Quest.entity";

import { ForbiddenError } from "apollo-server-express";
import { AppService } from "../../../app.service";
import { QuestService } from "../Quest.service";
import removeNulls from "../../../core/utils/helpers";
import { SiweMessage } from "siwe";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";
import { EditQuestInput } from "../dto/EditQuest.input";
import { QuizQuest } from "../QuizQuest.entity";
import { UseCeramicClient } from "../../../core/utils/types";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";

@Resolver(() => Quest)
export class EditQuestResolver {
  constructor(
    private readonly questService: QuestService,
    public readonly appService: AppService
  ) {}
  @Mutation(() => Quest, {
    nullable: true,
    description: "Updates a Quest in dCompass",
    name: "editQuest",
  })
  async editQuest(
    @UseSiwe() siwe: SiweMessage,
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input")
    { id, questType, ...editQuestData }: EditQuestInput
  ): Promise<Quest | null | undefined> {
    let foundQuest = null;
    if (questType === "quiz") {
      foundQuest = await this.questService.quizQuestWithPathwayAndProjectSquads(
        {
          id: id,
        }
      );
    }
    if (questType === "bounty") {
      foundQuest =
        await this.questService.bountyQuestWithPathwayAndProjectSquads({
          id: id,
        });
    }

    if (!foundQuest) {
      throw new NotFoundException("Quest not found by back-end");
    }

    const { address } = siwe;

    const { pathway } = foundQuest;
    if (!pathway) {
      throw new NotFoundException("Quest has no parent pathway");
    }
    const { project } = pathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project");
    }
    // TODO: Keep track of address & network to avoid impersonation
    console.log({ address });
    const projectContributors = project.squads
      ? project.squads.flatMap((squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    const isOwner = foundQuest.createdBy === address;

    if (!projectContributors.includes(address.toLowerCase()) || !isOwner) {
      throw new ForbiddenError("Unauthorized");
    }

    let updatedQuest = null;
    if (questType === "quiz") {
      const questionsToAdd = editQuestData.questions?.filter((q) => !q.id);
      const currentQuestionsIds = (foundQuest as QuizQuest).questions?.map(
        (q) => q.id
      );
      const questionIdsToDelete = currentQuestionsIds?.filter(
        (questionId) =>
          !editQuestData?.questions?.map((q) => q.id).includes(questionId)
      );
      const questionsToUpdate = editQuestData.questions?.filter(
        (q) => q.id && !questionIdsToDelete?.includes(q.id)
      );

      if (questionsToUpdate) {
        const encryptedUpdatedQuestions = await Promise.all(
          questionsToUpdate.map(async (q) => ({
            id: q.id,
            answer: JSON.stringify(
              await ceramicClient.ceramic.did?.createDagJWE(q.answer, [
                ceramicClient.ceramic.did.id.toString(),
              ])
            ),
            choices: q.choices,
            question: q.question,
          }))
        );

        await Promise.all(
          encryptedUpdatedQuestions.map(async (encryptedQuestion) =>
            this.questService.updateQuizQuestion({
              data: {
                ...encryptedQuestion,
              },
              where: {
                id: encryptedQuestion.id,
              },
            })
          )
        );
      }

      let createManyQuestionsQuery = {};
      let deleteManyQuestionsQuery = {};

      if (questionsToAdd) {
        const encryptedNewQuestions = await Promise.all(
          questionsToAdd.map(async (q) => ({
            answer: JSON.stringify(
              await ceramicClient.ceramic.did?.createDagJWE(q.answer, [
                ceramicClient.ceramic.did.id.toString(),
              ])
            ),
            choices: q.choices,
            question: q.question,
          }))
        );

        createManyQuestionsQuery = {
          createMany: {
            data: encryptedNewQuestions,
          },
        };
      }

      if (questionIdsToDelete && questionIdsToDelete.length > 0) {
        deleteManyQuestionsQuery = {
          deleteMany: {
            id: {
              in: questionIdsToDelete,
            },
          },
        };
      }

      updatedQuest = await this.questService.updateQuizQuest({
        where: {
          id: foundQuest.id,
        },
        data: {
          ...editQuestData,
          questions: {
            ...createManyQuestionsQuery,
            ...deleteManyQuestionsQuery,
          },
        },
      });
    }
    if (questType === "bounty") {
      const { questions, ...genericQuestData } = editQuestData;
      updatedQuest = await this.questService.updateBountyQuest({
        where: {
          id: foundQuest.id,
        },
        data: {
          ...genericQuestData,
        },
      });
    }

    return removeNulls(updatedQuest);
  }
}
