import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { Project } from '../../Projects/Project.entity';
import { Pathway } from '../Pathway.entity';

@Resolver(() => Project)
export class GetAllPathwaysByProjectIdResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}

  @Query(() => Project, {
    nullable: true,
    description: 'Gets all the pathways in dCompass',
    name: 'getAllPathwaysByProjectId',
  })
  async getAllPathwaysByProjectId(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('projectId') projectId: string,
  ): Promise<Project | null> {
    const foundProject = await this.threadDBService.getProjectById({
      dbClient,
      threadId: latestThreadId,
      projectId: projectId,
    });

    const pathwayIds = foundProject.pathways ? foundProject.pathways : [];

    const pendingPathwayIds = foundProject.pendingPathways
      ? foundProject.pendingPathways
      : [];

    const pathwaysWithDetails = await Promise.all(
      pathwayIds.map(async (pathwayId: string) => {
        const [foundPathway] = await this.threadDBService.query({
          collectionName: 'Pathway',
          dbClient,
          threadId: latestThreadId,
          query: new Where('_id').eq(pathwayId),
        });
        if (!foundPathway) {
          throw new NotFoundException('Pathway not found by back-end');
        }
        const { _id, quests, ...pathway } = foundPathway as any;
        return {
          id: _id,
          ...pathway,
          quests: quests
            ? quests.map((questId: string) => ({
                id: questId,
              }))
            : [],
        } as Pathway;
      }),
    );
    const pendingPathwaysWithDetails = await Promise.all(
      pendingPathwayIds.map(async (pathwayId: string) => {
        const [foundPathway] = await this.threadDBService.query({
          collectionName: 'Pathway',
          dbClient,
          threadId: latestThreadId,
          query: new Where('_id').eq(pathwayId),
        });
        if (!foundPathway) {
          throw new NotFoundException('Pathway not found by back-end');
        }
        const { _id, quests, ...pathway } = foundPathway as any;
        return {
          id: _id,
          ...pathway,
          quests: quests
            ? quests.map((questId: string) => ({
                id: questId,
              }))
            : [],
        } as Pathway;
      }),
    );

    // TODO: Query quests for each pathway

    return {
      ...foundProject,
      pathways: pathwaysWithDetails,
      pendingPathways: pendingPathwaysWithDetails,
    };
  }
}
