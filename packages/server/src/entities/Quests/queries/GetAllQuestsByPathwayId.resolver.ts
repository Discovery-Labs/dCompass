import { NotFoundException } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";

import removeNulls from "../../../core/utils/helpers";

import { Pathway } from "../../Pathways/Pathway.entity";
import { PathwayService } from "../../Pathways/Pathway.service";

@Resolver(() => Pathway)
export class GetAllQuestsByPathwayIdResolver {
  constructor(private readonly pathwayService: PathwayService) {}
  @Query(() => Pathway, {
    nullable: true,
    description: "Gets all the quests in dCompass",
    name: "getAllQuestsByPathwayId",
  })
  async getAllQuestsByPathwayId(
    @Args("pathwayId") pathwayId: string
  ): Promise<Pathway | null> {
    const foundPathway = await this.pathwayService.pathwayWithQuests({
      id: pathwayId,
    });
    if (!foundPathway) {
      throw new NotFoundException("Pathway not found");
    }

    return removeNulls({
      ...foundPathway,
    });
  }
}
