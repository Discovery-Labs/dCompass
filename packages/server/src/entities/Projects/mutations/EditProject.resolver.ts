import { NotFoundException } from "@nestjs/common";
import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ForbiddenError } from "apollo-server-errors";
import { ethers } from "ethers";

import { schemaAliases } from "../../../core/constants/idx";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseCeramicClient } from "../../../core/utils/types";
import { Squad } from "../../Squads/Squad.entity";
import { EditProjectInput } from "../dto/EditProject.input";
import { Project } from "../Project.entity";

@Resolver(() => [String])
export class EditProjectResolver {
  @Mutation(() => Project, {
    nullable: true,
    description: "Edit project in dCompass",
    name: "editProject",
  })
  async editProject(
    @UseCeramic()
    { ceramicClient }: UseCeramicClient,
    @Args("input") { id, editorSignature, ...projectValues }: EditProjectInput
  ): Promise<Project | null> {
    // Check that the current user is a contributor or the owner of the project
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id }),
      editorSignature
    );
    console.log({
      decodedAddress,
      id,
      projectValues,
    });
    const ogProject = await ceramicClient.ceramic.loadStream(id);
    const allContributors = ogProject.content.squads.flatMap(
      (squad: Squad) => squad.members
    );
    const ownerAccounts = await ceramicClient.dataStore.get(
      "cryptoAccounts",
      ogProject.controllers[0]
    );
    if (!ownerAccounts) throw new ForbiddenError("Unauthorized");
    const formattedOwnerAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split("@")[0]
    );
    const isOwner = formattedOwnerAccounts.includes(decodedAddress);
    const isContributor = allContributors.includes(decodedAddress);
    if (!isOwner || !isContributor) {
      throw new ForbiddenError("Unauthorized");
    }

    const existingProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS
    );
    const projects = existingProjects?.projects ?? [];
    console.log({ projects });
    const currentProjectValues = projects.find(
      (project: Project) => project.id === id
    );
    if (!currentProjectValues) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    const updatedProject = {
      id,
      ...currentProjectValues,
      ...projectValues,
      updatedBy: decodedAddress,
      updatedAt: new Date(),
    };

    await ceramicClient.dataStore.set(schemaAliases.APP_PROJECTS_ALIAS, {
      projects: [
        updatedProject,
        ...projects.filter((project: Project) => project.id !== id),
      ],
    });

    return updatedProject;
  }
}
