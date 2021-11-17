// import { Resolver, Query, Args } from '@nestjs/graphql';
// import { UseCeramic } from '../../../core/decorators/UseCeramic.decorator';
// import { Ceramic } from '../../../core/utils/types';
// import { Course } from '../Course.entity';

// @Resolver(() => Course)
// export class GetCourseByIdResolver {
//   @Query(() => Course, {
//     nullable: true,
//     description: 'Gets a course by its Stream ID',
//     name: 'getCourseById',
//   })
//   async getCourseById(
//     @UseCeramic() { ceramicClient }: UseCeramicClient,
//     @Args('courseId') courseId: string,
//   ): Promise<Course | null | undefined> {
//     console.log('COURSE QUERY');
//     const record = await ceramicClient.ceramic.loadStream(courseId);
//     if (!record) {
//       return null;
//     }
//     console.log({ record });
//     return {
//       id: courseId,
//       ...record.state.content,
//       quests: record.state.next?.content.quests,
//     };
//   }
// }
