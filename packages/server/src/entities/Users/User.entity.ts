import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  did: string;

  @Field(() => [String])
  addresses: string[];
}
