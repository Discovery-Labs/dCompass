import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-errors';
import { Where } from '@textile/hub';
import { ethers } from 'ethers';
import { AppService } from '../../../app.service';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { ApproveProjectInput } from '../dto/ApproveProject.input';
import { NotFoundException } from '@nestjs/common';
import { Tag } from '../../Tags/Tag.entity';
import { Project } from '../Project.entity';

@Resolver(() => Project)
export class ApproveProjectResolver {
  constructor(
    public readonly appService: AppService,
    private readonly threadDBService: ThreadDBService,
  ) {}
  @Mutation(() => Project, {
    nullable: true,
    description: 'Approves a new Project in dCompass',
    name: 'approveProject',
  })
  async approveProject(
    @UseThreadDB()
    { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('input')
    { id, tokenUris, reviewerSignature, chainId }: ApproveProjectInput,
  ): Promise<Project | null> {
    const [foundProjects, allTags] = await Promise.all([
      this.threadDBService.query({
        collectionName: 'Project',
        dbClient,
        threadId: latestThreadId,
        query: new Where('_id').eq(id),
      }),
      this.threadDBService.query({
        collectionName: 'Tag',
        threadId: latestThreadId,
        dbClient,
      }),
    ]);
    console.log({ foundProjects });

    if (!foundProjects || foundProjects.length === 0) {
      throw new NotFoundException('Project not found');
    }

    const [project] = foundProjects as any[];
    const { _id, _mod, ...rest } = project;

    // Check that the current user is a reviewer
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id, tokenUris, chainId }),
      reviewerSignature,
    );
    const projectNFTContract = this.appService.getContract(
      chainId,
      'ProjectNFT',
    );

    const isReviewer = await projectNFTContract.reviewers(decodedAddress);
    console.log({ isReviewer });
    if (!isReviewer) {
      throw new ForbiddenError('Unauthorized');
    }

    const statusId = await projectNFTContract.status(project.streamId);
    const status = await projectNFTContract.statusStrings(statusId);
    const isApproved = status === 'APPROVED';
    if (!isApproved) {
      throw new Error('Project not approved yet on-chain');
    }

    await this.threadDBService.update({
      collectionName: 'Project',
      dbClient,
      threadId: latestThreadId,
      values: [{ _id, ...rest, isFeatured: isApproved, tokenUris }],
    });

    const serializedProject = {
      id: _id,
      ...rest,
      isFeatured: isApproved,
      tokenUris,
      tags: allTags
        .map((t: any) => ({ id: t._id, ...t }))
        .filter((tag: any) =>
          project.tags.map((pjTag: Tag) => pjTag.id).includes(tag.id),
        ),
    } as Project;

    return serializedProject;
  }
}
