// import { Resolver, Query } from '@nestjs/graphql';
// import { UseCeramicClient } from '../../../core/decorators/UseCeramicClient.decorator';
// import { Ceramic } from '../../../core/utils/types';
// import { CoursesList } from '../mutations/CreateCourse.resolver';
// import { Course } from '../Course.entity';

// @Resolver(() => [Course])
// export class GetAllCoursesResolver {
//   @Query(() => [Course], {
//     nullable: true,
//     description: 'Gets all the courses in Discovery',
//     name: 'getAllCourses',
//   })
//   async getAllCourses(
//     @UseCeramicClient() ceramicClient: Ceramic,
//   ): Promise<Course[] | null | undefined> {
//     const allDiscoveryCourses = await ceramicClient.idx.get<CoursesList>(
//       'courses',
//     );
//     if (allDiscoveryCourses) {
//       const mergedCourses = await Promise.all(
//         allDiscoveryCourses?.courses.map(async (course) => {
//           const record = await ceramicClient.ceramic.loadStream(course.id);
//           if (!record) {
//             return null;
//           }
//           return {
//             id: course.id,
//             title: course.title,
//             ...record.state.content,
//             quests: record.state.next?.content.quests,
//           };
//         }),
//       );
//       return mergedCourses;
//     }
//     return undefined;
//   }
// }
