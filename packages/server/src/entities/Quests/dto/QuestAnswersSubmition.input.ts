import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsDefined, IsNotEmpty, IsArray } from 'class-validator';
import { QuestQuestionAnswerInput } from './QuestQuestionAnswer.input';

@InputType()
export class QuestAnswersSubmitionInput {
  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  questId: string;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  did: string;

  @Field(() => [QuestQuestionAnswerInput])
  @IsArray({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  questionAnswers: QuestQuestionAnswerInput[];
}
