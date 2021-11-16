import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Website {
  @Field()
  name: string;
  @Field()
  url: string;
}
