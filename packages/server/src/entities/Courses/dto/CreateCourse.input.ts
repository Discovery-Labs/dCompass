import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsArray,
  IsEnum,
} from 'class-validator';
import { CourseDifficultyEnum, CourseTypeEnum } from '../Course.entity';
import { CourseProjectInput } from './CourseProjectInput';

@InputType()
export class CreateCourseInput {
  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  title: string;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  description: string;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  gitbook: string;

  @Field(() => CourseDifficultyEnum)
  @IsEnum(CourseDifficultyEnum, { message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  difficulty: CourseDifficultyEnum;

  @Field(() => CourseTypeEnum)
  @IsEnum(CourseTypeEnum, { message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  courseType: CourseTypeEnum;

  @Field(() => [String])
  @IsArray({ message: 'wrong.type' })
  preRequisiteCourses?: string[];

  @Field(() => [CourseProjectInput])
  @IsArray({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  projects: CourseProjectInput[];
}
