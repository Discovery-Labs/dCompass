import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class QuizQuestion {
  @Field()
  question: string;

  @Field()
  answer: string;

  @Field(() => [String])
  choices: string[];
}
