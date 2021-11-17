// import { Resolver, Query } from '@nestjs/graphql';
// import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
// import { Ceramic } from '../../../core/utils/types';
// import { TagsList } from '../mutations/CreateTag.resolver';
// import { Tag } from '../Tag.entity';

// @Resolver(() => [Tag])
// export class GetAllTagsResolver {
//   @Query(() => [Tag], {
//     nullable: true,
//     description: 'Gets all the tags in Discovery',
//     name: 'getAllTags',
//   })
//   async getAllTags(
//     @UseCeramic() { ceramicClient }: UseCeramicClient,
//   ): Promise<Tag[] | null | undefined> {
//     const allDiscoveryTags = await ceramicClient.idx.get<TagsList>('tags');
//     if (allDiscoveryTags?.tags && allDiscoveryTags.tags.length > 0) {
//       const mergedTags = await Promise.all(
//         allDiscoveryTags?.tags.map(async (tag) => {
//           const record = await ceramicClient.ceramic.loadStream(tag.id);
//           if (!record) {
//             return null;
//           }
//           return {
//             id: tag.id,
//             name: tag.name,
//             ...record.state.content,
//           };
//         }),
//       );
//       return mergedTags;
//     }
//     return undefined;
//   }
// }
