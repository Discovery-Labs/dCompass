import { Injectable } from "@nestjs/common";
import { Pathway, Prisma } from "@prisma/client";
import { PrismaService } from "src/services/prisma/Prisma.service";

type PathwayWithProjectInfos = Prisma.PathwayGetPayload<{
  include: {
    project: {
      include: {
        squads: true;
      };
    };
  };
}>;
type PathwayWithQuestsAndProjectInfos = Prisma.PathwayGetPayload<{
  include: {
    quizQuests: true;
    bountyQuests: true;
    project: {
      include: {
        squads: true;
      };
    };
  };
}>;
@Injectable()
export class PathwayService {
  constructor(private prisma: PrismaService) {}

  async pathway(
    pathwayWhereUniqueInput: Prisma.PathwayWhereUniqueInput
  ): Promise<Pathway | null> {
    return this.prisma.pathway.findUnique({
      where: pathwayWhereUniqueInput,
    });
  }

  async pathwayWithQuestsAndProjectInfos(
    pathwayWhereUniqueInput: Prisma.PathwayWhereUniqueInput
  ): Promise<PathwayWithQuestsAndProjectInfos | null> {
    return this.prisma.pathway.findUnique({
      where: pathwayWhereUniqueInput,
      include: {
        quizQuests: true,
        bountyQuests: true,
        project: {
          include: {
            squads: true,
          },
        },
      },
    });
  }
  async pathwayWithProjectInfos(
    pathwayWhereUniqueInput: Prisma.PathwayWhereUniqueInput
  ): Promise<PathwayWithProjectInfos | null> {
    return this.prisma.pathway.findUnique({
      where: pathwayWhereUniqueInput,
      include: {
        project: {
          include: {
            squads: true,
          },
        },
      },
    });
  }

  async pathways(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PathwayWhereUniqueInput;
    where?: Prisma.PathwayWhereInput;
    orderBy?: Prisma.PathwayOrderByWithRelationInput;
  }): Promise<Pathway[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.pathway.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createPathway(data: Prisma.PathwayCreateInput): Promise<Pathway> {
    return this.prisma.pathway.create({
      data,
    });
  }

  async updatePathway(params: {
    where: Prisma.PathwayWhereUniqueInput;
    data: Prisma.PathwayUpdateInput;
  }): Promise<Pathway> {
    const { data, where } = params;
    return this.prisma.pathway.update({
      data,
      where,
    });
  }

  async deletePathway(where: Prisma.PathwayWhereUniqueInput): Promise<Pathway> {
    return this.prisma.pathway.delete({
      where,
    });
  }
}
