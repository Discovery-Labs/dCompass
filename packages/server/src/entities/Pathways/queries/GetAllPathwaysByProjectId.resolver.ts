import { Resolver, Query, Args } from "@nestjs/graphql";
// import { Where } from "@textile/hub";

// import { UseThreadDB } from "../../../core/decorators/UseThreadDB.decorator";
// import { UseThreadDBClient } from "../../../core/utils/types";
// import { ThreadDBService } from "../../../services/thread-db/thread-db.service";
import { Project } from "../../Projects/Project.entity";
import { ProjectService } from "../../Projects/Project.service";

@Resolver(() => Project)
export class GetAllPathwaysByProjectIdResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => Project, {
    nullable: true,
    description: "Gets all the pathways in dCompass",
    name: "getAllPathwaysByProjectId",
  })
  async getAllPathwaysByProjectId(
    @Args("projectId") projectId: string
  ): Promise<Project | null> {
    const project = await this.projectService.projectWithAllNestedRel({
      id: projectId,
    });
    return project as any;
  }
}
