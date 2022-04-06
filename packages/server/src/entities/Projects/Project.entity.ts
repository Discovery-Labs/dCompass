import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';
import { Pathway } from '../Pathways/Pathway.entity';
import { Squad } from '../Squads/Squad.entity';
import { Tag } from '../Tags/Tag.entity';

export type CeramicStreamId = string;
@ObjectType()
export class Project extends BaseEntity {
  @Field()
  id: string;

  @Field()
  streamId: string;

  @Field()
  name: string;

  @Field()
  color?: string;

  @Field()
  whitepaper?: string;

  @Field()
  website: string;

  @Field()
  twitter?: string;

  @Field()
  discord?: string;

  @Field()
  github?: string;

  @Field()
  gitbook?: string;

  @Field()
  createdBy: string;

  @Field()
  updatedBy: string;

  @Field()
  description: string;

  @Field()
  slogan: string;

  @Field()
  logo?: string;

  @Field(() => [String])
  contracts: string[];

  @Field(() => [String])
  members?: string[];

  @Field(() => [String])
  pendingMembers?: string[];

  @Field(() => [String])
  tokenUris: string[];

  @Field(() => Boolean, { defaultValue: false })
  isFeatured: boolean;

  @Field(() => [Tag])
  tags?: Tag[];

  @Field(() => [Pathway])
  pathways?: Pathway[];

  @Field(() => [Pathway])
  pendingPathways?: Pathway[];

  @Field(() => [Squad])
  squads: Squad[];

  @Field(() => [String])
  repos?: CeramicStreamId[];

  @Field(() => [String])
  peerProjects?: CeramicStreamId[];
}
