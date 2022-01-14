import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class QuizQuestion {
  @Field()
  question: string;

  // TODO: handle both sign & multiple answers
  @Field()
  answer: string;

  @Field(() => [String])
  choices: string[];
}
