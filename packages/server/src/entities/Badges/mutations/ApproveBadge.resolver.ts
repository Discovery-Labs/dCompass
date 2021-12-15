import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import { ForbiddenError } from 'apollo-server-express';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Badge } from '../Badge.entity';
import { schemaAliases } from '../../../core/constants/idx';
import { ApproveBadgeInput } from '../dto/ApproveBadge.input';
import { Squad } from '../../Squads/Squad.entity';

@Resolver(() => Badge)
export class ApproveBadgeResolver {
  @Mutation(() => Badge, {
    nullable: true,
    description: 'Approve a new Badge in dCompass',
    name: 'approveBadge',
  })
  async approveBadge(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input') { id, badgeApproverSignature }: ApproveBadgeInput,
  ): Promise<Badge | null | undefined> {
    // Check that the current user is the owner of the project
    const ogBadge = await ceramicClient.ceramic.loadStream(id);
    console.log(ogBadge.content);
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: ogBadge.content.projectId }),
      badgeApproverSignature,
    );

    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );
    const projects = allProjects?.projects ?? [];

    console.log({ projects });
    console.log({ ogBadge: ogBadge.content });

    const projectIndexedFields = projects.find(
      (project: { id: string }) => project.id === ogBadge.content.projectId,
    );
    const projectContributors = projectIndexedFields.squads.flatMap(
      (squad: Squad) => squad.members.map((m) => m.toLowerCase()),
    );

    if (
      !projectIndexedFields ||
      !projectContributors.includes(decodedAddress)
    ) {
      throw new ForbiddenError('Unauthorized');
    }

    console.log({ projectIndexedFields });

    // remove previously indexed project and recreate it as with the new pending badge
    const existingProjects = projects.filter(
      (project: { id: string }) => project.id !== projectIndexedFields.id,
    );

    console.log({ existingProjects });
    // Add the new badge for review
    const appProjectsUpdated = [
      {
        id,
        ...projectIndexedFields,
        // add badge in approved badges
        badges: [...(projectIndexedFields.badges ?? []), ogBadge.id.toUrl()],
        // remove badge from pending badges
        pendingBadges: [
          ...(projectIndexedFields.pendingBadges
            ? projectIndexedFields.pendingBadges.filter(
                (badge: string) => badge !== ogBadge.id.toUrl(),
              )
            : []),
        ],
      },
      ...existingProjects,
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
