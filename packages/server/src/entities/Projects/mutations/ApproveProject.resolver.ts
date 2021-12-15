import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-errors';
import { ethers } from 'ethers';
import { AppService } from '../../../app.service';

import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { ApproveProjectInput } from '../dto/ApproveProject.input';
import { ApproveProjectOutput } from '../dto/ApproveProject.output';

@Resolver(() => [String])
export class ApproveProjectResolver {
  constructor(public readonly appService: AppService) {}
  @Mutation(() => [ApproveProjectOutput], {
    nullable: true,
    description: 'Approves a new Project in dCompass',
    name: 'approveProject',
  })
  async approveProject(
    @UseCeramic()
    { ceramicClient }: UseCeramicClient,
    @Args('input')
    { id, tokenUris, reviewerSignature, chainId }: ApproveProjectInput,
  ): Promise<ApproveProjectOutput[] | null> {
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

    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );
    const projects = allProjects?.projects ?? [];

    console.log({ projects });

    const projectIndexedFields = projects.find(
      (project: { id: string }) => project.id === id,
    );
    if (!projectIndexedFields) {
      return null;
    }

    console.log({ projectIndexedFields });

    const statusId = await projectNFTContract.status(id);
    const status = await projectNFTContract.statusStrings(statusId);
    console.log({ status, statusId });
    if (status !== 'APPROVED') {
      return null;
    }
    // remove previously unfeatured project and recreate it as featured
    const existingProjects = projects.filter(
      (project: { id: string }) => project.id !== projectIndexedFields.id,
    );

    console.log({ existingProjects });
    const allProjectsUpdated = [
      { id, ...projectIndexedFields, tokenUris, isFeatured: true },
      ...existingProjects,
    ];

    await ceramicClient.dataStore.set(schemaAliases.APP_PROJECTS_ALIAS, {
      projects: allProjectsUpdated,
    });

    const refechProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );

    return refechProjects.projects;
  }
}
