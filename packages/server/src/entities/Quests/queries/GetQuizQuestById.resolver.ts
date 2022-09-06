import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";
import { SiweMessage } from "siwe";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";

import removeNulls from "../../../core/utils/helpers";
import { UseCeramicClient } from "../../../core/utils/types";
import { QuestService } from "../Quest.service";
import { QuizQuest } from "../QuizQuest.entity";

@Resolver(() => QuizQuest)
export class GetQuizQuestByIdResolver {
  constructor(private readonly questService: QuestService) {}
  @Query(() => QuizQuest, {
    nullable: true,
    description: "Gets a quiz quest by its ID",
    name: "getQuizQuestById",
  })
  async getQuizQuestById(
    @UseSiwe() siwe: SiweMessage,
    @UseCeramic() { ceramicCore, ceramicClient }: UseCeramicClient,
    @Args("questId") questId: string
  ): Promise<QuizQuest | null | undefined> {
    console.log("getting quiz quest");
    let foundQuest = null;
    foundQuest = await this.questService.quizQuestWithPathwayAndProjectSquads({
      id: questId,
    });

    if (!foundQuest) {
      const foundBountyQuest =
        await this.questService.bountyQuestWithPathwayAndProjectSquads({
          id: questId,
        });
      if (!foundBountyQuest) {
        throw new NotFoundException("Quest not found by back-end");
      }
      foundQuest = foundBountyQuest;
    }

    const questInfos = await ceramicCore.ceramic.loadStream(
      foundQuest.streamId
    );
    const questCreatorDID = questInfos.controllers[0];

    // TODO: append this data to createdBy
    // const questCreatorBasicProfile = await ceramicCore.get(
    //   "basicProfile",
    //   questCreatorDID
    // );

    const { pathway } = foundQuest;
    if (!pathway) {
      throw new NotFoundException("Quest has no parent pathway");
    }
    const { project } = pathway;
    if (!project) {
      throw new NotFoundException("Pathway has no parent project");
    }

    // 1. check if signature matches an address in the crypto accounts of the did provided

    const { address } = siwe;
    console.log({ address });
    if (!address) {
      throw new ForbiddenException("Unauthorized");
    }

    // 2. check if decoded address is in project contributors
    // TODO: Keep track of address & network to avoid impersonation
    const projectContributors = project.squads
      ? project.squads.flatMap((squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    const isProjectContributor = projectContributors.includes(
      address.toLowerCase()
    );

    console.log({ isProjectContributor });

    let decryptedQuestions = [] as any[];

    if (isProjectContributor && foundQuest.questType === "quiz") {
      const quizQuest = foundQuest as unknown as QuizQuest;
      const parsedQuestions = quizQuest.questions?.map((question) => ({
        ...question,
        answer: JSON.parse(question.answer),
      }));

      if (parsedQuestions) {
        console.log({ parsedQuestions });
        decryptedQuestions = await Promise.all(
          parsedQuestions.map(async (question) => {
            const decryptedSolution =
              await ceramicClient.ceramic.did?.decryptDagJWE(question.answer);
            return {
              id: question.id,
              question: question.question,
              content: question.content,
              choices: question.choices,
              answer: JSON.stringify(decryptedSolution),
            };
          })
        );
      }
    }

    console.log(decryptedQuestions);

    return removeNulls({
      ...foundQuest,
      questions:
        decryptedQuestions.length > 0
          ? decryptedQuestions
          : (foundQuest as unknown as QuizQuest).questions ?? [],
      chainId: questInfos.content.chainId,
      namespace: questInfos.content.namespace,
      createdBy: questCreatorDID,
    });
  }
}
