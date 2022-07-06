import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ForbiddenError } from "apollo-server-express";

import { Pathway } from "../Pathway.entity";

import { AppService } from "../../../app.service";

import { PathwayService } from "../Pathway.service";
import { NotFoundException } from "@nestjs/common";
import removeNulls from "../../../core/utils/helpers";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";
import { SiweMessage } from "siwe";
import { EditPathwayInput } from "../dto/EditPathway.input";

@Resolver(() => Pathway)
export class EditPathwayResolver {
  constructor(
    public readonly appService: AppService,
    private readonly pathwayService: PathwayService
  ) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: "Edit a Pathway in dCompass",
    name: "editPathway",
  })
  async editPathway(
    @UseSiwe() siwe: SiweMessage,
    @Args("input")
    { id, ...pathwayUpdateValues }: EditPathwayInput
  ): Promise<Pathway | null | undefined> {
    const foundPathway = await this.pathwayService.pathwayWithProjectInfos({
      id,
    });

    if (!foundPathway) {
      throw new NotFoundException("Pathway not found!");
    }

    const { project } = foundPathway;

    if (!project) {
      throw new NotFoundException("Pathway has no parent project!");
    }
    const { address } = siwe;
    // TODO: Keep track of address & network to avoid impersonation
    const projectContributors = project.squads
      ? project.squads.flatMap((squad) =>
          squad.members.map((m) => m.toLowerCase())
        )
      : [];

    if (!projectContributors.includes(address.toLowerCase())) {
      throw new ForbiddenError("Unauthorized");
    }

    const updatedPathway = await this.pathwayService.updatePathway({
      where: {
        id: foundPathway.id,
      },
      data: {
        ...pathwayUpdateValues,
      },
    });

    return removeNulls(updatedPathway);
  }
}
