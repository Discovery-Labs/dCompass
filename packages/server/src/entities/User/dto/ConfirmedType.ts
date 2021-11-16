import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConfirmedType {
  @Field(() => Boolean)
  confirmed: boolean;
}
