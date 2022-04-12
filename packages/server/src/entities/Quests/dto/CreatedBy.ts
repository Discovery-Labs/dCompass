import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreatedBy {
  @Field()
  did: string;

  @Field()
  name: string;
}
