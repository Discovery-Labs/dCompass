import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Where } from '@textile/hub';

import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { Tag } from '../../Tags/Tag.entity';

import { Project } from '../Project.entity';

@Resolver(() => Project)
export class GetProjectByIdResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}

  @Query(() => Project, {
    nullable: true,
    description: 'Gets a project by its document ID',
    name: 'getProjectById',
  })
  async getProjectById(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
    @Args('projectId') projectId: string,
  ): Promise<Project | null | undefined> {
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

    return {
      id: _id,
      ...rest,
      tags: allTags
        .map((t: any) => ({ id: t._id, ...t }))
        .filter((tag: any) =>
          project.tags.map((pjTag: Tag) => pjTag.id).includes(tag.id),
        ),
    } as Project;
  }
}
