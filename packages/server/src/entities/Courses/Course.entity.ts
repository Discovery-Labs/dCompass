import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';
import { Project } from '../Projects/Project.entity';
import { Quest } from '../Quests/Quest.entity';

export enum CourseTypeEnum {
  BRANCHED = 'branched',
  DECRYPTED = 'decrypted',
}

export enum CourseDifficultyEnum {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  WIZARD = 'wizard',
}

registerEnumType(CourseTypeEnum, {
  name: 'CourseTypeEnum',
  description:
    'Branched = theorical lessons and Decrypted = technical hands on lessons',
});

registerEnumType(CourseDifficultyEnum, {
  name: 'CourseDifficultyEnum',
  description:
    'The difficulty of a course, from beginner to wizard where wizard is the most difficult mode',
});

export type CeramicStreamId = string;
@ObjectType()
export class Course extends BaseEntity {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  gitbook: string;

  @Field()
  description: string;

  @Field(() => CourseTypeEnum)
  courseType: CourseTypeEnum;

  @Field(() => CourseDifficultyEnum)
  difficulty: CourseDifficultyEnum;

  @Field(() => [Quest])
  quests?: Quest[];

  @Field(() => [Project])
  projects: Project[];
}
