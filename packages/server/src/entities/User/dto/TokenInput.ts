import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TokenInput {
  @Field()
  token: string;
}
