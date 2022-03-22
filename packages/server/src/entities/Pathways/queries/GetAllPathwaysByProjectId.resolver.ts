import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { Tag } from '../../Tags/Tag.entity';
import { Pathway } from '../Pathway.entity';

@Resolver(() => [Pathway])
export class GetAllPathwaysByProjectIdResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}

  @Query(() => [Pathway], {
    nullable: true,
    description: 'Gets all the pathways in dCompass',
    name: 'getAllPathwaysByProjectId',
  })
  async getAllPathwaysByProjectId(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('projectId') projectId: string,
  ): Promise<Pathway[] | null> {
    const [foundProjects, allTags] = await Promise.all([
      this.threadDBService.query({
        collectionName: 'Project',
        dbClient,
        threadId: latestThreadId,
        query: new Where('_id').eq(projectId),
      }),
      this.threadDBService.query({
        collectionName: 'Tag',
        threadId: latestThreadId,
        dbClient,
      }),
    ]);

    if (!foundProjects || foundProjects.length === 0) {
      throw new NotFoundException('Project not found');
    }

    const [project] = foundProjects as any[];
    const { _id, _mod, ...rest } = project;

    const foundProject = {
      id: _id,
      ...rest,
      tags: allTags
        .map((t: any) => ({ id: t._id, ...t }))
        .filter((tag: any) =>
          project.tags.map((pjTag: Tag) => pjTag.id).includes(tag.id),
        ),
    };

    const pathwayIds = foundProject.pathways ? foundProject.pathways : [];

    const pendingPathwayIds = foundProject.pendingPathways
      ? foundProject.pendingPathways
      : [];

    const pathwaysWithDetails = await Promise.all(
      pathwayIds.map(async (pathwayId: string) =>
        this.threadDBService.query({
          collectionName: 'Pathway',
          dbClient,
          threadId: latestThreadId,
          query: new Where('_id').eq(pathwayId),
        }),
      ),
    );
    const pendingPathwaysWithDetails = await Promise.all(
      pendingPathwayIds.map(async (pathwayId: string) =>
        this.threadDBService.query({
          collectionName: 'Pathway',
          dbClient,
          threadId: latestThreadId,
          query: new Where('_id').eq(pathwayId),
        }),
      ),
    );

    // TODO: Query quests for each pathway
    console.log({ pathwaysWithDetails, pendingPathwaysWithDetails });
    return [...pathwaysWithDetails, ...pendingPathwaysWithDetails];
  }
}
