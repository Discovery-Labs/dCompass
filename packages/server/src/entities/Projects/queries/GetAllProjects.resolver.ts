// import { Resolver, Query } from '@nestjs/graphql';
// import { UseCeramicClient } from '../../../core/decorators/UseCeramicClient.decorator';
// import { Ceramic } from '../../../core/utils/types';
// import { ProjectsList } from '../mutations/CreateProject.resolver';
// import { Project } from '../Project.entity';

// @Resolver(() => [Project])
// export class GetAllProjectsResolver {
//   @Query(() => [Project], {
//     nullable: true,
//     description: 'Gets all the projects in Discovery',
//     name: 'getAllProjects',
//   })
//   async getAllProjects(
//     @UseCeramicClient() ceramicClient: Ceramic,
//   ): Promise<Project[] | null | undefined> {
//     const allDiscoveryProjects = await ceramicClient.idx.get<ProjectsList>(
//       'projects',
//     );
//     if (allDiscoveryProjects?.projects) {
//       const mergedProjects = await Promise.all(
//         allDiscoveryProjects?.projects.map(async (project) => {
//           const record = await ceramicClient.ceramic.loadStream(project.id);
//           if (!record) {
//             return null;
//           }
//           return {
//             id: project.id,
//             name: project.name,
//             ...record.state.content,
//             courses: record.state.next?.content.courses,
//           };
//         }),
//       );
//       return mergedProjects;
//     }
//     return undefined;
//   }
// }
