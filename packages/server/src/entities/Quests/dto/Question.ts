import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Question {
  @Field()
  question: string;
  @Field(() => [String])
  choices: string[];
  @Field()
  answer: string;
}
