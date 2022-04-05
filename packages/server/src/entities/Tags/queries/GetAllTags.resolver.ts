import { Resolver, Query } from '@nestjs/graphql';
import { UseThreadDB } from '../../../core/decorators/UseThreadDB.decorator';
import { UseThreadDBClient } from '../../../core/utils/types';
import { ThreadDBService } from '../../../services/thread-db/thread-db.service';
import { Tag } from '../Tag.entity';

@Resolver(() => [Tag])
export class GetAllTagsResolver {
  constructor(private readonly threadDBService: ThreadDBService) {}
  @Query(() => [Tag], {
    nullable: true,
    description: 'Gets all the tags in Discovery',
    name: 'getAllTags',
  })
  async getAllTags(
    @UseThreadDB() { dbClient, latestThreadId }: UseThreadDBClient,
  ): Promise<Tag[] | undefined> {
    const allTags = await this.threadDBService.query({
      collectionName: 'Tag',
      threadId: latestThreadId,
      dbClient,
    });

    console.log({ allTags });
    if (!allTags) {
      return undefined;
    }
    return allTags.map((tag: any) => ({
      id: tag._id,
      ...tag,
    })) as Tag[];
  }
}
