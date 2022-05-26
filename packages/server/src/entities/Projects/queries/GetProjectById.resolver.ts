import { NotFoundException } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";

import { Project } from "../Project.entity";
import { ProjectService } from "../Project.service";

@Resolver(() => Project)
export class GetProjectByIdResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => Project, {
    nullable: true,
    description: "Gets a project by its document ID",
    name: "getProjectById",
  })
  async getProjectById(
    @Args("projectId") projectId: string
  ): Promise<Project | null | undefined> {
    const projectWithSquadsAndTags =
      await this.projectService.projectWithAllNestedRel({
        id: projectId,
      });

    if (!projectWithSquadsAndTags) {
      throw new NotFoundException("Project not found");
    }
    return projectWithSquadsAndTags as unknown as Project;
  }
}
