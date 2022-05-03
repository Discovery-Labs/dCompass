import { NotFoundException } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";
import { Where } from "@textile/hub";

import { UseThreadDB } from "../../../core/decorators/UseThreadDB.decorator";
import removeNulls from "../../../core/utils/helpers";
import { UseThreadDBClient } from "../../../core/utils/types";
import { ThreadDBService } from "../../../services/thread-db/thread-db.service";
import { Pathway } from "../Pathway.entity";
import { PathwayService } from "../Pathway.service";

@Resolver(() => Pathway)
export class GetPathwayByIdResolver {
  constructor(private readonly pathwayService: PathwayService) {}
  @Query(() => Pathway, {
    nullable: true,
    description: "Gets a pathway by its Stream ID",
    name: "getPathwayById",
  })
  async getPathwayById(
    @Args("pathwayId") pathwayId: string
  ): Promise<Pathway | null | undefined> {
    const foundPathway =
      await this.pathwayService.pathwayWithQuestsAndProjectInfos({
        id: pathwayId,
      });
    if (!foundPathway) {
      throw new NotFoundException("Pathway not found by back-end");
    }
    const { projectId, project } = foundPathway;
    if (!projectId || !project) {
      throw new NotFoundException("Pathway has no parent project!");
    }
    return removeNulls(foundPathway);
  }
}
