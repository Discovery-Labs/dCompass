import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ForbiddenError } from "apollo-server-errors";
import { AppService } from "../../../app.service";

import { ApproveProjectInput } from "../dto/ApproveProject.input";
import { NotFoundException } from "@nestjs/common";

import { Project } from "../Project.entity";
import { ProjectService } from "../Project.service";
import removeNulls from "../../../core/utils/helpers";
import { SiweMessageInput } from "../../Users/dto/SiweMessageInput";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";

@Resolver(() => Project)
export class ApproveProjectResolver {
  constructor(
    public readonly appService: AppService,
    private readonly projectService: ProjectService
  ) {}
  @Mutation(() => Project, {
    nullable: true,
    description: "Approves a new Project in dCompass",
    name: "approveProject",
  })
  async approveProject(
    @UseSiwe() siwe: SiweMessageInput,
    @Args("input")
    { id, tokenUris }: ApproveProjectInput
  ): Promise<Project | null> {
    const foundProject = await this.projectService.project({ id: id });

    if (!foundProject) {
      throw new NotFoundException("Project not found");
    }

    // Check that the current user is a reviewer
    const { address, chainId } = siwe;

    const projectNFTContract = this.appService.getContract(
      chainId.toString(),
      "ProjectNFT"
    );

    const isReviewer = await projectNFTContract.reviewers(address);
    console.log({ isReviewer });
    if (!isReviewer) {
      throw new ForbiddenError("Unauthorized");
    }

    const statusId = await projectNFTContract.status(foundProject.streamId);
    const status = await projectNFTContract.statusStrings(statusId);
    const isApproved = status === "APPROVED";
    if (!isApproved) {
      throw new Error("Project not approved yet on-chain");
    }

    await this.projectService.updateProject({
      where: {
        id: foundProject.id,
      },
      data: { ...foundProject, isFeatured: isApproved, tokenUris },
    });

    const updatedProject = await this.projectService.projectWithSquadsAndTags({
      id: foundProject.id,
    });

    return removeNulls(updatedProject) as Project;
  }
}
