import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class QuizQuestion {
  @Field()
  id: string;

  @Field(() => Int, { defaultValue: 0 })
  order: number;

  @Field(() => String, { defaultValue: "" })
  content: string;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field(() => [String])
  choices: string[];
}
