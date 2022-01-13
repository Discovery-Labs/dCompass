import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
// TODO: extend from chainId & namespace
export class ExpandedServerSignature {
  @Field()
  r: string;
  @Field()
  s: string;
  @Field(() => Int)
  v: number;
}
