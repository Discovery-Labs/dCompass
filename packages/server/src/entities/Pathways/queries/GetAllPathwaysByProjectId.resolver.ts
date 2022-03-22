import { Resolver, Query, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { Project } from '../../Projects/Project.entity';

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
        const [pathway] = await this.threadDBService.query({
          collectionName: 'Pathway',
          dbClient,
          threadId: latestThreadId,
          query: new Where('_id').eq(pathwayId),
        });
        return {
          id: (pathway as any)._id,
          ...(pathway as any),
        };
      }),
    );
    const pendingPathwaysWithDetails = await Promise.all(
      pendingPathwayIds.map(async (pathwayId: string) => {
        const [pathway] = await this.threadDBService.query({
          collectionName: 'Pathway',
          dbClient,
          threadId: latestThreadId,
          query: new Where('_id').eq(pathwayId),
        });
        return {
          id: (pathway as any)._id,
          ...(pathway as any),
        };
      }),
    );

    // TODO: Query quests for each pathway
    console.log({ pathwaysWithDetails, pendingPathwaysWithDetails });
    return {
      ...foundProject,
      pathways: pathwaysWithDetails,
      pendingPathways: pendingPathwaysWithDetails,
    };
  }
}
