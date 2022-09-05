import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class QuizQuestion {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field(() => [String])
  choices: string[];
}
