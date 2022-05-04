import { ObjectType, Field } from "@nestjs/graphql";
import { BaseEntity } from "../../core/entities/BaseEntity";

export type CeramicStreamId = string;
@ObjectType()
export class Tag extends BaseEntity {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field()
  value: string;

  @Field()
  color: string;
}
