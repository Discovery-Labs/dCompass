// import { Resolver, Query } from '@nestjs/graphql';
// import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
// import { Ceramic } from '../../../core/utils/types';
// import { ContributorsList } from '../mutations/JoinAsContributor.resolver';
// import { Contributor } from '../Contributor.entity';

// @Resolver(() => [Contributor])
// export class GetAllContributorsResolver {
//   @Query(() => [Contributor], {
//     nullable: true,
//     description: 'Gets all the contributors in Discovery',
//     name: 'getAllContributors',
//   })
//   async getAllContributors(
//     @UseCeramic() { ceramicClient }: UseCeramicClient,
//   ): Promise<Contributor[] | null | undefined> {
//     const allDiscoveryContributors =
//       await ceramicClient.idx.get<ContributorsList>('contributors');
//     if (allDiscoveryContributors) {
//       const mergedContributors = await Promise.all(
//         allDiscoveryContributors?.contributors.map(async (contributor) => {
//           const record = await ceramicClient.ceramic.loadStream(contributor.id);
//           if (!record) {
//             return null;
//           }
//           return {
//             id: contributor.id,
//             did: contributor.did,
//             githubUsername: contributor.githubUsername,
//             ...record.state.content,
//           };
//         }),
//       );
//       return mergedContributors;
//     }
//     return undefined;
//   }
// }
