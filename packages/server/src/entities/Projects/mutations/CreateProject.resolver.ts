import { BadRequestException } from "@nestjs/common";
import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ProjectSquad } from "@prisma/client";
import { ForbiddenError } from "apollo-server-errors";
import { SiweMessage } from "siwe";

import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";
import removeNulls from "../../../core/utils/helpers";
import { UseCeramicClient } from "../../../core/utils/types";
import { Squad } from "../../Squads/Squad.entity";
import { CreateProjectInput } from "../dto/CreateProject.input";
import { Project } from "../Project.entity";
import { ProjectService } from "../Project.service";

@Resolver(() => [String])
export class CreateProjectResolver {
  constructor(private readonly projectService: ProjectService) {}
  @Mutation(() => Project, {
    nullable: true,
    description: "Create a new Project in dCompass",
    name: "createProject",
  })
  async createProject(
    @UseSiwe() siwe: SiweMessage,
    @UseCeramic()
    { ceramicClient, ceramicCore }: UseCeramicClient,
    @Args("input") { id, tokenUris }: CreateProjectInput
  ): Promise<Project | null> {
    // Check that the current user is the owner of the project
    const { address } = siwe;

    let ogProject;
    try {
      ogProject = await ceramicClient.ceramic.loadStream(id);
    } catch (error) {
      // retry after first failed attempt to load the stream
      try {
        ogProject = await ceramicClient.ceramic.loadStream(id);
      } catch (retryError) {
        throw new BadRequestException("Failed to load project stream " + id);
      }
    }

    const ownerAccounts = await ceramicCore.get(
      "cryptoAccounts",
      ogProject.controllers[0]
    );

    if (!ownerAccounts) throw new ForbiddenError("Unauthorized");
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split("@")[0]
    );
    if (!formattedAccounts.includes(address)) {
      throw new ForbiddenError("Unauthorized");
    }

    const { squads, tags, ...ogProjectInfos } = ogProject.content;

    const prismaProject = await this.projectService.createProject({
      streamId: id,
      ...ogProjectInfos,
      tags: {
        connect: tags,
      },
      tokenUris,
      isFeatured: false,
      createdBy: address,
    });

    await this.projectService.createSquads(
      squads.map((squad: Squad) => ({
        ...squad,
        projectId: prismaProject.id,
      }))
    );

    const projectWithSquadsAndTags =
      await this.projectService.projectWithSquadsAndTags({
        id: prismaProject.id,
      });

    const serializedProject = removeNulls(projectWithSquadsAndTags) as
      | (Project & {
          squads: ProjectSquad[];
        })
      | null;
    return serializedProject;
  }
}
