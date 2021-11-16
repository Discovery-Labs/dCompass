import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Question } from './Question';
import { QuestQuestionInput } from './QuestQuestion.input';

@InputType()
export class CreateQuestInput {
  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  courseId: string;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  name: string;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  description: string;

  @Field(() => [QuestQuestionInput])
  @IsArray({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  questions: Question[];

  @Field(() => [String], { nullable: true })
  @IsArray({ message: 'wrong.type' })
  @IsOptional()
  preRequisites?: string[];
}
