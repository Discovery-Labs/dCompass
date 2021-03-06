import { Injectable } from "@nestjs/common";
import {
  QuizQuest,
  BountyQuest,
  Prisma,
  SolutionSubmission,
  QuizQuestion,
} from "@prisma/client";
import { PrismaService } from "src/services/prisma/Prisma.service";

type QuizQuestWithPathwayAndProjectSquads = Prisma.QuizQuestGetPayload<{
  include: {
    questions: true;
    pathway: {
      include: {
        project: {
          include: {
            squads: true;
          };
        };
      };
    };
  };
}>;
type BountyQuestWithPathwayAndProjectSquads = Prisma.BountyQuestGetPayload<{
  include: {
    submissions: true;
    pathway: {
      include: {
        project: {
          include: {
            squads: true;
          };
        };
      };
    };
  };
}>;
@Injectable()
export class QuestService {
  constructor(private prisma: PrismaService) {}

  async quizQuest(
    questWhereUniqueInput: Prisma.QuizQuestWhereUniqueInput
  ): Promise<QuizQuest | null> {
    return this.prisma.quizQuest.findUnique({
      where: questWhereUniqueInput,
    });
  }

  async quizQuestWithPathwayAndProjectSquads(
    questWhereUniqueInput: Prisma.QuizQuestWhereUniqueInput
  ): Promise<QuizQuestWithPathwayAndProjectSquads | null> {
    return this.prisma.quizQuest.findUnique({
      where: questWhereUniqueInput,
      include: {
        questions: true,
        pathway: {
          include: {
            project: {
              include: {
                squads: true,
              },
            },
          },
        },
      },
    });
  }

  async bountyQuestWithPathwayAndProjectSquads(
    questWhereUniqueInput: Prisma.BountyQuestWhereUniqueInput
  ): Promise<BountyQuestWithPathwayAndProjectSquads | null> {
    return this.prisma.bountyQuest.findUnique({
      where: questWhereUniqueInput,
      include: {
        submissions: true,
        pathway: {
          include: {
            project: {
              include: {
                squads: true,
              },
            },
          },
        },
      },
    });
  }

  async quizQuests(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.QuizQuestWhereUniqueInput;
    where?: Prisma.QuizQuestWhereInput;
    orderBy?: Prisma.QuizQuestOrderByWithRelationInput;
  }): Promise<QuizQuest[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.quizQuest.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createQuizQuest(data: Prisma.QuizQuestCreateInput): Promise<QuizQuest> {
    return this.prisma.quizQuest.create({
      data,
    });
  }

  async updateQuizQuest(params: {
    where: Prisma.QuizQuestWhereUniqueInput;
    data: Prisma.QuizQuestUpdateInput;
  }): Promise<QuizQuest> {
    const { data, where } = params;
    return this.prisma.quizQuest.update({
      data,
      where,
    });
  }

  async deleteQuizQuest(
    where: Prisma.QuizQuestWhereUniqueInput
  ): Promise<QuizQuest> {
    return this.prisma.quizQuest.delete({
      where,
    });
  }

  async updateQuizQuestion(params: {
    data: Prisma.QuizQuestionUpdateInput;
    where: Prisma.QuizQuestionWhereUniqueInput;
  }): Promise<QuizQuestion> {
    const { data, where } = params;
    return this.prisma.quizQuestion.update({ data, where });
  }

  async bountyQuest(
    questWhereUniqueInput: Prisma.BountyQuestWhereUniqueInput
  ): Promise<BountyQuest | null> {
    return this.prisma.bountyQuest.findUnique({
      where: questWhereUniqueInput,
    });
  }

  async bountyQuests(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BountyQuestWhereUniqueInput;
    where?: Prisma.BountyQuestWhereInput;
    orderBy?: Prisma.BountyQuestOrderByWithRelationInput;
  }): Promise<BountyQuest[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.bountyQuest.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createBountyQuest(
    data: Prisma.BountyQuestCreateInput
  ): Promise<BountyQuest> {
    return this.prisma.bountyQuest.create({
      data,
    });
  }

  async updateBountyQuest(params: {
    where: Prisma.BountyQuestWhereUniqueInput;
    data: Prisma.BountyQuestUpdateInput;
  }): Promise<BountyQuest> {
    const { data, where } = params;
    return this.prisma.bountyQuest.update({
      data,
      where,
    });
  }
  async updateBountyQuestSubmission(params: {
    where: Prisma.SolutionSubmissionWhereUniqueInput;
    data: Prisma.SolutionSubmissionUpdateInput;
  }): Promise<SolutionSubmission> {
    const { data, where } = params;
    return this.prisma.solutionSubmission.update({
      where: where,
      data: data,
    });
  }

  async deleteBountyQuest(
    where: Prisma.BountyQuestWhereUniqueInput
  ): Promise<BountyQuest> {
    return this.prisma.bountyQuest.delete({
      where,
    });
  }
}
