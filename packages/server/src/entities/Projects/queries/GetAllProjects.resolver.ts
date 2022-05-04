import { Resolver, Query } from "@nestjs/graphql";

import { Project } from "../Project.entity";
import { ProjectService } from "../Project.service";

@Resolver(() => [Project])
export class GetAllProjectsResolver {
  constructor(private readonly projectService: ProjectService) {}
  @Query(() => [Project], {
    nullable: true,
    description: "Gets all the projects in dCompass",
    name: "getAllProjects",
  })
  async getAllProjects(): Promise<Project[] | null | undefined> {
    const allProjects = await this.projectService.projects({
      include: {
        squads: true,
        tags: true,
      },
    });

    return allProjects as Project[];
  }
}
