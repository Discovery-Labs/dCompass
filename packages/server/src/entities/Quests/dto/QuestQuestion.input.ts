import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsNotEmpty, IsArray } from 'class-validator';
import { QuestQuestionAnswerInput } from './QuestQuestionAnswer.input';

@InputType()
export class QuestQuestionInput extends QuestQuestionAnswerInput {
  @Field(() => [String])
  @IsArray({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  choices: string[];
}
