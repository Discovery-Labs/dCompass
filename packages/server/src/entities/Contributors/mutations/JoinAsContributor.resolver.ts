// import { Resolver, Mutation, Args } from '@nestjs/graphql';
// import { UseCeramicClient } from '../../../core/decorators/UseCeramicClient.decorator';
// import { Ceramic } from '../../../core/utils/types';
// import { createCeramicDocument } from '../../../services/ceramic/ceramic.service';
// import { Contributor } from '../Contributor.entity';
// import { JoinAsContributorInput } from '../dto/JoinAsContributor.input';

// export type ContributorItem = {
//   id: string;
//   did: string;
//   githubUsername: string;
// };

// export type ContributorsList = { contributors: Array<ContributorItem> };
// @Resolver(() => Contributor)
// export class JoinAsContributorResolver {
//   @Mutation(() => Contributor, {
//     nullable: true,
//     description: 'Join Discovery as a Contributor',
//     name: 'joinAsContributor',
//   })
//   async createContributor(
//     @UseCeramicClient() ceramicClient: Ceramic,
//     @Args('input') { did, githubUsername }: JoinAsContributorInput,
//   ): Promise<Contributor | null | undefined> {
//     const createdContributor = await createCeramicDocument(ceramicClient, {
//       data: { did, githubUsername },
//       family: 'contributor',
//       schema: ceramicClient.schemasCommitId['contributor'],
//     });
//     if (!createdContributor) {
//       return null;
//     }

//     const existingContributors = await ceramicClient.idx.get<ContributorsList>(
//       'contributors',
//     );

//     const contributors = existingContributors?.contributors ?? [];
//     await ceramicClient.idx.set('contributors', {
//       contributors: [
//         { id: createdContributor.doc.id.toUrl(), did, githubUsername },
//         ...contributors,
//       ],
//     });

//     const allContributors = await ceramicClient.idx.get<ContributorsList>(
//       'contributors',
//     );
//     console.log(allContributors);

//     return createdContributor.doc.content;
//   }
// }
