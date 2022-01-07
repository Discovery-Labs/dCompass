import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Project } from '../../Projects/Project.entity';
import { Badge } from '../Badge.entity';

@Resolver(() => [Badge])
export class GetAllBadgesByProjectIdResolver {
  @Query(() => [Badge], {
    nullable: true,
    description: 'Gets all the badges in dCompass',
    name: 'getAllBadgesByProjectId',
  })
  async getAllBadgesByProjectId(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('projectId') projectId: string,
  ): Promise<Badge[] | null> {
    const allProjects = await ceramicClient.dataStore.get(
      schemaAliases.APP_PROJECTS_ALIAS,
    );
    const projects = allProjects?.projects ?? [];
    console.log(projects);
    const foundProject = projects.find(
      (project: Project) => project.id === projectId,
    );

    console.log({ foundProject });
    if (!foundProject) {
      throw new NotFoundException('Project not found');
    }
    const badgeIds = foundProject.badges
      ? foundProject.badges.map((id: string) => ({
          streamId: id,
        }))
      : [];

    const pendingBadgeIds = foundProject.pendingBadges
      ? foundProject.pendingBadges.map((id: string) => ({
          streamId: id,
        }))
      : [];

    console.log({ badgeIds });

    const [badgesWithDetails, pendingBadgesWithDetails] = await Promise.all([
      ceramicClient.ceramic.multiQuery(badgeIds),
      ceramicClient.ceramic.multiQuery(pendingBadgeIds),
    ]);

    console.log({ badgesWithDetails, pendingBadgesWithDetails });

    const serializedBadges = Object.values(badgesWithDetails).map((stream) => {
      return {
        id: stream.id.toUrl(),
        ...stream.state.content,
        isPending: false,
      };
    });

    const serializedPendingBadges = Object.values(pendingBadgesWithDetails).map(
      (stream) => {
        return {
          id: stream.id.toUrl(),
          ...stream.state.content,
          isPending: true,
        };
      },
    );
    console.log({ serializedBadges, serializedPendingBadges });
    return [...serializedBadges, ...serializedPendingBadges];
  }
}
