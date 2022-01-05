import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ethers } from 'ethers';
import { ForbiddenError } from 'apollo-server-express';

import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Badge } from '../Badge.entity';
import { schemaAliases } from '../../../core/constants/idx';
import { ApproveBadgeInput } from '../dto/ApproveBadge.input';
import { Squad } from '../../Squads/Squad.entity';
import { NotFoundException } from '@nestjs/common';

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
    const projectId = ogBadge.content.projectId;
    console.log(ogBadge.content);
    const decodedAddress = ethers.utils.verifyMessage(
      JSON.stringify({ id: id, projectId }),
      badgeApproverSignature,
    );

    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );
    const projects = allProjects?.projects ?? [];
    const ogProject = await ceramicClient.ceramic.loadStream(projectId);

    const additionalFields = projects.find(
      (project: { id: string }) => project.id === projectId,
    );

    if (!ogProject || !additionalFields) {
      throw new NotFoundException('Project not found');
    }

    const projectIndexedFields = {
      ...ogProject.content,
      ...additionalFields,
    };

    const projectContributors = projectIndexedFields.squads
      ? projectIndexedFields.squads.flatMap((squad: Squad) =>
          squad.members.map((m) => m.toLowerCase()),
        )
      : [];

    if (
      !projectIndexedFields ||
      !projectContributors.includes(decodedAddress.toLowerCase())
    ) {
      throw new ForbiddenError('Unauthorized');
    }

    // remove previously indexed project and recreate it as with the new pending badge
    const existingProjects = projects.filter(
      (project: { id: string }) => project.id !== projectIndexedFields.id,
    );

    // Add the new badge for review
    const appProjectsUpdated = [
      {
        id: projectId,
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

    const previousBadges = await ceramicClient.dataStore.get(
      schemaAliases.BADGES_ALIAS,
    );
    const allBadges = previousBadges.badges ?? [];
    await ceramicClient.dataStore.set(schemaAliases.BADGES_ALIAS, {
      badges: [
        ...allBadges,
        {
          id: ogBadge.id.toUrl(),
          ...ogBadge.content,
        },
      ],
    });
    return {
      id,
      ...ogBadge.content,
    };
  }
}
