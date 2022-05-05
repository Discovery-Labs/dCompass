import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ForbiddenError } from "apollo-server-express";

import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseCeramicClient } from "../../../core/utils/types";
import { CreatePathwayInput } from "../dto/CreatePathway.input";
import { Pathway } from "../Pathway.entity";
import { PathwayService } from "../Pathway.service";
import removeNulls from "../../../core/utils/helpers";
import { SiweMessage } from "siwe";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";

@Resolver(() => Pathway)
export class CreatePathwayResolver {
  constructor(private readonly pathwayService: PathwayService) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: "Create a new Pathway in dCompass",
    name: "createPathway",
  })
  async createPathway(
    @UseSiwe() siwe: SiweMessage,
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input") { id }: CreatePathwayInput
  ): Promise<Pathway | null | undefined> {
    // Check that the current user is the owner of the pathway
    const ogPathway = await ceramicClient.ceramic.loadStream(id);
    const { projectId, ...ogPathwayInfos } = ogPathway.content;
    console.log(ogPathway.content);
    const { address } = siwe;

    const ownerAccounts = await ceramicClient.dataStore.get(
      "cryptoAccounts",
      ogPathway.controllers[0]
    );
    console.log({ ownerAccounts, address });
    if (!ownerAccounts) throw new ForbiddenError("Unauthorized");
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split("@")[0]
    );
    if (!formattedAccounts.includes(address)) {
      throw new ForbiddenError("Unauthorized");
    }
    const createdPathway = await this.pathwayService.createPathway({
      project: {
        connect: {
          id: projectId,
        },
      },
      ...ogPathwayInfos,
      difficulty: ogPathway.content.difficulty.toUpperCase(),
      streamId: id,
      isPending: true,
    });

    return removeNulls(createdPathway) as Pathway;
  }
}
