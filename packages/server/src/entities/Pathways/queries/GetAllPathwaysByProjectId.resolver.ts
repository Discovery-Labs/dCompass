// import { NotFoundException } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";
// import { Where } from "@textile/hub";

// import { UseThreadDB } from "../../../core/decorators/UseThreadDB.decorator";
// import { UseThreadDBClient } from "../../../core/utils/types";
// import { ThreadDBService } from "../../../services/thread-db/thread-db.service";
import { Project } from "../../Projects/Project.entity";
import { ProjectService } from "../../Projects/Project.service";
// import { Pathway } from "../Pathway.entity";

@Resolver(() => Project)
export class GetAllPathwaysByProjectIdResolver {
  constructor(
    // private readonly threadDBService: ThreadDBService,
    private readonly projectService: ProjectService
  ) {}

  @Query(() => Project, {
    nullable: true,
    description: "Gets all the pathways in dCompass",
    name: "getAllPathwaysByProjectId",
  })
  async getAllPathwaysByProjectId(
    // @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args("projectId") projectId: string
  ): Promise<Project | null> {
    const project = await this.projectService.projectWithAllNestedRel({
      id: projectId,
    });
    return project as any;
  }
}
