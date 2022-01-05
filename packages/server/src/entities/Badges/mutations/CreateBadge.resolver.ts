import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import { ForbiddenError } from 'apollo-server-express';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { CreateBadgeInput } from '../dto/CreateBadge.input';
import { Badge } from '../Badge.entity';
import { schemaAliases } from '../../../core/constants/idx';

@Resolver(() => Badge)
export class CreateBadgeResolver {
  @Mutation(() => Badge, {
    nullable: true,
    description: 'Create a new Badge in dCompass',
    name: 'createBadge',
  })
  async createBadge(
    @UseCeramic() { ceramicClient, ceramicCore }: UseCeramicClient,
    @Args('input') { id, badgeCreatorSignature }: CreateBadgeInput,
  ): Promise<Badge | null | undefined> {
    // Check that the current user is the owner of the project
    const ogBadge = await ceramicClient.ceramic.loadStream(id);
    const projectId = ogBadge.content.projectId;
    console.log(ogBadge.content);
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: projectId }),
      badgeCreatorSignature,
    );

    const ownerAccounts = await ceramicCore.get(
      'cryptoAccounts',
      ogBadge.controllers[0],
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
    console.log({ ogBadge: ogBadge.content });

    const projectIndexedFields = projects.find(
      (project: { id: string }) => project.id === projectId,
    );
    if (!projectIndexedFields) {
      return null;
    }

    console.log({ projectIndexedFields });

    // remove previously indexed project and recreate it as with the new pending badge
    const existingProjects = projects.filter(
      (project: { id: string }) => project.id !== projectIndexedFields.id,
    );

    console.log({ existingProjects });
    // Add the new badge for review
    const appProjectsUpdated = [
      ...existingProjects,
      {
        id,
        ...projectIndexedFields,
        pendingBadges: [
          ...(projectIndexedFields.pendingBadges ?? []),
          ogBadge.id.toUrl(),
        ],
      },
    ];

    await ceramicClient.dataStore.set(schemaAliases.APP_PROJECTS_ALIAS, {
      projects: appProjectsUpdated,
    });

    return {
      id,
      ...ogBadge.content,
    };
  }
}
