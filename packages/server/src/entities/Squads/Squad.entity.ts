import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';

export type CeramicStreamId = string;
@ObjectType()
export class Squad extends BaseEntity {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  image?: string;

  @Field(() => [String])
  members: string[];
}
