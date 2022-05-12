import { Injectable } from "@nestjs/common";
import { Project, Prisma } from "@prisma/client";
import { PrismaService } from "src/services/prisma/Prisma.service";

type ProjectWithSquads = Prisma.ProjectGetPayload<{
  include: {
    squads: true;
  };
}>;
type ProjectWithSquadsAndTags = Prisma.ProjectGetPayload<{
  include: {
    squads: true;
    tags: true;
  };
}>;

type ProjectWithAllNestedRel = Prisma.ProjectGetPayload<{
  include: {
    squads: true;
    tags: true;
    pathways: {
      include: {
        quizQuests: true;
        bountyQuests: {
          include: {
            submissions: true;
          };
        };
      };
    };
  };
}>;
@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async project(
    projectWhereUniqueInput: Prisma.ProjectWhereUniqueInput
  ): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: projectWhereUniqueInput,
    });
  }
  async projectWithSquads(
    projectWhereUniqueInput: Prisma.ProjectWhereUniqueInput
  ): Promise<ProjectWithSquads | null> {
    return this.prisma.project.findUnique({
      where: projectWhereUniqueInput,
      include: {
        squads: true,
      },
    });
  }

  async projectWithSquadsAndTags(
    projectWhereUniqueInput: Prisma.ProjectWhereUniqueInput
  ): Promise<ProjectWithSquadsAndTags | null> {
    return this.prisma.project.findUnique({
      where: projectWhereUniqueInput,
      include: {
        squads: true,
        tags: true,
      },
    });
  }

  async projectWithAllNestedRel(
    projectWhereUniqueInput: Prisma.ProjectWhereUniqueInput
  ): Promise<ProjectWithAllNestedRel | null> {
    return this.prisma.project.findUnique({
      where: projectWhereUniqueInput,
      include: {
        squads: true,
        tags: true,
        pathways: {
          include: {
            quizQuests: true,
            bountyQuests: {
              include: {
                submissions: true,
              },
            },
          },
        },
      },
    });
  }

  async projects(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjectWhereUniqueInput;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput;
    include?: Prisma.ProjectInclude;
  }): Promise<(Project | ProjectWithSquads | ProjectWithSquadsAndTags)[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.project.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async createProject(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  async updateProject(params: {
    where: Prisma.ProjectWhereUniqueInput;
    data: Prisma.ProjectUpdateInput;
  }): Promise<Project> {
    const { data, where } = params;
    return this.prisma.project.update({
      data,
      where,
    });
  }
  async updateProjectAndSquads(params: {
    where: Prisma.ProjectWhereUniqueInput;
    data: Prisma.ProjectUpdateInput;
  }): Promise<Project> {
    const { data, where } = params;
    return this.prisma.project.update({
      data,
      where,
    });
  }

  async deleteProject(where: Prisma.ProjectWhereUniqueInput): Promise<Project> {
    return this.prisma.project.delete({
      where,
    });
  }

  async createSquads(
    data: Prisma.ProjectSquadCreateManyInput
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.projectSquad.createMany({ data });
  }
}
