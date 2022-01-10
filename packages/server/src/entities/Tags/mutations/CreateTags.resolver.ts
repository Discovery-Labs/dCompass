import { TileDocument } from '@ceramicnetwork/stream-tile';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import publishedModel from '@discovery-dao/schemas/lib/model.json';

import { schemaAliases } from '../../../core/constants/idx';
import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
import { UseCeramicClient } from '../../../core/utils/types';
import { CreateTagsInput } from '../dto/CreateTags.input';
import { Tag } from '../Tag.entity';

@Resolver(() => [Tag])
export class CreateTagsResolver {
  @Mutation(() => [Tag], {
    nullable: true,
    description: 'Creates multiple new Tags in Discovery',
    name: 'createTags',
  })
  async createTags(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args('input') { tags }: CreateTagsInput,
  ): Promise<Tag[] | null | undefined> {
    const createdTags = await Promise.all(
      tags.map((tag) =>
        TileDocument.create(ceramicClient.ceramic, tag, {
          controllers: [ceramicClient.dataStore.id.toString()],
          family: schemaAliases.TAG_ALIAS,
          schema: publishedModel.schemas['Tag'],
        }),
      ),
    );

    console.log({ createdTags });

    const previousTags = await ceramicClient.dataStore.get(
      schemaAliases.TAGS_ALIAS,
    );

    console.log({ previousTags });
    const existingTags = previousTags?.tags ?? [];

    const allTagIds = [
      ...existingTags,
      ...createdTags.map((tag) => tag.id.toUrl()),
    ];

    // Index the tags
    await ceramicClient.dataStore.set(schemaAliases.TAGS_ALIAS, {
      tags: allTagIds,
    });

    // Get all the tags with its content
    const allTagsWithContent = await ceramicClient.ceramic.multiQuery(
      allTagIds.map((tagStreamId) => ({
        streamId: tagStreamId,
      })),
    );
    return Object.entries(allTagsWithContent).map(([streamId, document]) => ({
      id: streamId,
      ...document.content,
    }));
  }
}
