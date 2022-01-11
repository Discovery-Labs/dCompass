import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import { ForbiddenError } from 'apollo-server-express';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { CreatePathwayInput } from '../dto/CreatePathway.input';
import { Pathway } from '../Pathway.entity';
import { schemaAliases } from '../../../core/constants/idx';

@Resolver(() => Pathway)
export class CreatePathwayResolver {
  @Mutation(() => Pathway, {
    nullable: true,
    description: 'Create a new Pathway in dCompass',
    name: 'createPathway',
  })
  async createPathway(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input') { id, pathwayCreatorSignature }: CreatePathwayInput,
  ): Promise<Pathway | null | undefined> {
    // Check that the current user is the owner of the project
    const ogPathway = await ceramicClient.ceramic.loadStream(id);
    const projectId = ogPathway.content.projectId;
    console.log(ogPathway.content);
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: projectId }),
      pathwayCreatorSignature,
    );

    const ownerAccounts = await ceramicClient.dataStore.get(
      'cryptoAccounts',
      ogPathway.controllers[0],
    );
    if (!ownerAccounts) throw new ForbiddenError('Unauthorized');
    const formattedAccounts = Object.keys(ownerAccounts).map(
      (account) => account.split('@')[0],
    );
    if (!formattedAccounts.includes(decodedAddress)) {
      throw new ForbiddenError('Unauthorized');
    }

    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );
    const projects = allProjects?.projects ?? [];

    console.log({ projects });
    console.log({ ogPathway: ogPathway.content });

    const projectIndexedFields = projects.find(
      (project: { id: string }) => project.id === projectId,
    );
    if (!projectIndexedFields) {
      return null;
    }

    console.log({ projectIndexedFields });

    // remove previously indexed project and recreate it as with the new pending pathway
    const existingProjects = projects.filter(
      (project: { id: string }) => project.id !== projectIndexedFields.id,
    );

    console.log({ existingProjects });
    // Add the new pathway for review
    const appProjectsUpdated = [
      ...existingProjects,
      {
        id,
        ...projectIndexedFields,
        pendingPathways: [
          ...(projectIndexedFields.pendingPathways ?? []),
          ogPathway.id.toUrl(),
        ],
      },
    ];

    await ceramicClient.dataStore.set(schemaAliases.APP_PROJECTS_ALIAS, {
      projects: appProjectsUpdated,
    });

    return {
      id,
      ...ogPathway.content,
    };
  }
}
