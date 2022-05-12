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
    const foundProject = await this.projectService.project({ id });

    if (!foundProject) {
      throw new NotFoundException("Project not found");
    }

    // const updatedSquads = squads
    //   ? {
    //       updateMany: {
    //         data: squads,
    //         where: {
    //           id: {
    //             in: squads?.map((s) => s.id),
    //           },
    //           projectId: foundProject.id,
    //         },
    //       },
    //     }
    //   : undefined;
    // const newTags = tags
    //   ? {
    //       connect: tags.map((tag) => ({ id: tag })),
    //     }
    //   : undefined;
    await this.projectService.updateProject({
      where: {
        id: foundProject.id,
      },
      data: {
        ...foundProject,
        ...projectValues,
        // tags: newTags,
      },
    });

    const updatedProject = await this.projectService.projectWithSquadsAndTags({
      id: foundProject.id,
    });

    return removeNulls(updatedProject);
  }
}
