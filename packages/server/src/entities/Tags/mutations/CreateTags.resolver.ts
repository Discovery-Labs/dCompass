// import { TileDocument } from '@ceramicnetwork/stream-tile';
// import { Resolver, Mutation, Args } from '@nestjs/graphql';
// import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
// import { Ceramic } from '../../../core/utils/types';
// import { createCeramicDocument } from '../../../services/ceramic/ceramic.service';
// import { CreateTagsInput } from '../dto/CreateTags.input';
// import { Tag } from '../Tag.entity';
// import { TagsList } from './CreateTag.resolver';

// @Resolver(() => [Tag])
// export class CreateTagsResolver {
//   @Mutation(() => [Tag], {
//     nullable: true,
//     description: 'Creates multiple new Tags in Discovery',
//     name: 'createTags',
//   })
//   async createTags(
//     @UseCeramic() { ceramicClient }: UseCeramicClient,
//     @Args('input') { tags }: CreateTagsInput,
//   ): Promise<Tag[] | null | undefined> {
//     const createdTags = [] as
//       | {
//           streamId: string;
//           doc: TileDocument<any>;
//         }[];
//     for (const tag of tags) {
//       const createdTag = await createCeramicDocument(ceramicClient, {
//         data: tag,
//         family: 'tag',
//         schema: ceramicClient.schemasCommitId['tag'],
//       });
//       if (!createdTag) {
//         return null;
//       }
//       createdTags.push(createdTag);
//     }

//     const existingTags = await ceramicClient.idx.get<TagsList>('tags');
//     const allTags = existingTags?.tags ?? [];

//     await ceramicClient.idx.set('tags', {
//       tags: [
//         ...createdTags.map((tag) => ({
//           id: tag.doc.id.toUrl(),
//           name: tag.doc.content.name,
//         })),
//         ...allTags,
//       ],
//     });

//     return createdTags.map((tag) => ({
//       id: tag.doc.id.toUrl(),
//       ...tag.doc.content,
//     }));
//   }
// }
