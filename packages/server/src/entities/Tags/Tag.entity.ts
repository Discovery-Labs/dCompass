import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';

export type CeramicStreamId = string;
@ObjectType()
export class Tag extends BaseEntity {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  color: string;
}
