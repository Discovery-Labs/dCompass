import { Resolver, Query } from '@nestjs/graphql';
import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { Tag } from '../Tag.entity';

@Resolver(() => [Tag])
export class GetAllTagsResolver {
  @Query(() => [Tag], {
    nullable: true,
    description: 'Gets all the tags in Discovery',
    name: 'getAllTags',
  })
  async getAllTags(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
  ): Promise<Tag[] | null | undefined> {
    const allTags = await ceramicClient.dataStore.get(schemaAliases.TAGS_ALIAS);
    if (allTags?.tags && allTags.tags.length > 0) {
      console.log(allTags);
      const allTagsWithContent = await ceramicClient.ceramic.multiQuery(
        allTags.tags.map((tagStreamId: string) => ({
          streamId: tagStreamId,
        })),
      );
      return Object.entries(allTagsWithContent).map(([streamId, document]) => ({
        id: streamId,
        ...document.content,
      }));
    }
    return undefined;
  }
}
