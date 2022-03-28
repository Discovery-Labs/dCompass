import { Resolver, Query } from '@nestjs/graphql';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { Tag } from '../../Tags/Tag.entity';
import { Project } from '../Project.entity';

@Resolver(() => [Project])
export class GetAllProjectsResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Query(() => [Project], {
    nullable: true,
    description: 'Gets all the projects in dCompass',
    name: 'getAllProjects',
  })
  async getAllProjects(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
  ): Promise<Project[] | null | undefined> {
    const [allProjects, allTags] = await Promise.all([
      this.threadDBService.query({
        collectionName: 'Project',
        threadId: latestThreadId,
        dbClient,
      }),
      this.threadDBService.query({
        collectionName: 'Tag',
        threadId: latestThreadId,
        dbClient,
      }),
    ]);
    return allProjects.map((project: any) => ({
      id: project._id,
      ...project,
      tags: allTags
        .map((t: any) => ({ id: t._id, ...t }))
        .filter((tag: any) =>
          project.tags.map((pjTag: Tag) => pjTag.id).includes(tag.id),
        ),
    })) as Project[];
  }
}
