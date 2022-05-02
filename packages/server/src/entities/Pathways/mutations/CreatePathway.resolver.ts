import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ethers } from "ethers";
import { ForbiddenError } from "apollo-server-express";

import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseCeramicClient } from "../../../core/utils/types";
import { CreatePathwayInput } from "../dto/CreatePathway.input";
import { Pathway } from "../Pathway.entity";
import { PathwayService } from "../Pathway.service";
import removeNulls from "../../../core/utils/helpers";

@Resolver(() => Pathway)
export class CreatePathwayResolver {
  constructor(private readonly pathwayService: PathwayService) {}

  @Mutation(() => Pathway, {
    nullable: true,
    description: "Create a new Pathway in dCompass",
    name: "createPathway",
  })
  async createPathway(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input") { id, pathwayCreatorSignature }: CreatePathwayInput
  ): Promise<Pathway | null | undefined> {
    // Check that the current user is the owner of the pathway
    const ogPathway = await ceramicClient.ceramic.loadStream(id);
    const projectId = ogPathway.content.projectId;
    console.log(ogPathway.content);
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id, projectId }),
      pathwayCreatorSignature
    );

    const ownerAccounts = await ceramicClient.dataStore.get(
      "cryptoAccounts",
      ogPathway.controllers[0]
    );
    console.log({ ownerAccounts, decodedAddress });
    if (!ownerAccounts) throw new ForbiddenError("Unauthorized");
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split("@")[0]
    );
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError("Unauthorized");
    }
    const createdPathway = await this.pathwayService.createPathway({
      project: {
        connect: {
          id: projectId,
        },
      },
      ...ogPathway.content,
      streamId: id,
      isPending: true,
    });

    return removeNulls(createdPathway) as Pathway;
  }
}
