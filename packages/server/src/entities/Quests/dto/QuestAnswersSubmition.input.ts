import { Field, InputType, Int } from '@nestjs/graphql';
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

  @Field()
  namespace?: string;

  @Field(() => Int)
  chainId: number;

  @Field()
  @IsString({ message: 'wrong.type' })
  @IsDefined({ message: 'not.defined' })
  @IsNotEmpty({ message: 'not.empty' })
  questAdventurerSignature: string;
}
