import { NotFoundException } from "@nestjs/common";
import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { SiweMessage } from "siwe";

import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";
import removeNulls from "../../../core/utils/helpers";

import { EditProjectInput } from "../dto/EditProject.input";
import { Project } from "../Project.entity";
import { ProjectService } from "../Project.service";

@Resolver(() => [String])
export class EditProjectResolver {
  constructor(private readonly projectService: ProjectService) {}
  @Mutation(() => Project, {
    nullable: true,
    description: "Edit project in dCompass",
    name: "editProject",
  })
  async editProject(
    @UseSiwe() siwe: SiweMessage,
    @Args("input")
    { id, tags, squads, whitepaper, ...projectValues }: EditProjectInput
  ): Promise<Project | null> {
    // Check that the current user is a contributor or the owner of the project
    const { address } = siwe;

    console.log({
      address,
      id,
      projectValues,
    });
    const foundProject = await this.projectService.projectWithSquadsAndTags({
      id,
    });

    if (!foundProject) {
      throw new NotFoundException("Project not found");
    }

    const currentSquadsIds = foundProject.squads.map((squad) => squad.id);

    // TODO: handle edge case where there was a squad that gets deleted, throw err
    if (squads) {
      const squadsToAdd = squads.filter((squad) => !squad.id);
      if (squadsToAdd) {
        const createdSquads = await this.projectService.createSquads(
          squadsToAdd.map((squad) => ({
            ...squad,
            projectId: foundProject.id,
          })) as any
        );
        console.log({ createdSquads });
      }

      const squadsIdsToRemove = currentSquadsIds.filter(
        (squadId) => !squads.map((squad) => squad.id).includes(squadId)
      );

      if (squadsIdsToRemove) {
        await this.projectService.deleteSquads({
          where: {
            id: {
              in: squadsIdsToRemove,
            },
            projectId: foundProject.id,
          },
        });
        console.log({ squadsIdsToRemove });
      }

      const existingSquadsToUpdate = squads
        .filter((squad) => squad.id && !squadsIdsToRemove.includes(squad.id))
        .map((squad) => ({
          id: squad.id!,
          name: squad.name,
          image: squad.image,
          members: squad.members,
        }));
      await Promise.all(
        existingSquadsToUpdate.map(async (squadToUpdate) =>
          this.projectService.updateSquad({
            data: squadToUpdate,
            where: {
              id: squadToUpdate.id,
            },
          })
        )
      );
    }

    const currentTagIds = foundProject.tags.map((tag) => tag.id);
    const tagsToRemove =
      tags && currentTagIds
        ? {
            disconnect: currentTagIds
              .filter((tag) => !tags.includes(tag))
              .map((tag) => ({ id: tag })),
          }
        : undefined;

    const tagsToAdd = tags
      ? {
          connect: tags.map((tag) => ({ id: tag })),
        }
      : undefined;

    await this.projectService.updateProject({
      where: {
        id: foundProject.id,
      },
      data: {
        ...projectValues,
        tags: {
          ...tagsToAdd,
          ...tagsToRemove,
        },
      },
    });

    const updatedProject = await this.projectService.projectWithSquadsAndTags({
      id: foundProject.id,
    });

    return removeNulls(updatedProject);
  }
}
