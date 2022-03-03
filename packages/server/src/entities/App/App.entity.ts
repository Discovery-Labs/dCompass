import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AppEntity {
  @Field()
  did: string;
}
