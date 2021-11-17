import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';
import { Course } from '../Courses/Course.entity';
import { Squad } from '../Squads/Squad.entity';
import { Tag } from '../Tags/Tag.entity';
import { Website } from './dto/WebSite';

export type CeramicStreamId = string;
@ObjectType()
export class Project extends BaseEntity {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  color?: string;

  @Field()
  whitepaper?: string;

  @Field(() => [Website])
  websites?: Website[];

  @Field()
  twitter?: string;

  @Field()
  discord?: string;

  @Field()
  github: string;

  @Field()
  description: string;

  @Field()
  logo?: string;

  @Field(() => [String])
  contracts: string[];

  @Field()
  tokenUri: string;

  @Field(() => Boolean, { defaultValue: false })
  isFeatured: boolean;

  @Field(() => [Tag])
  tags?: Tag[];

  @Field(() => [Course])
  courses?: Course[];

  @Field(() => [Squad])
  squads: Squad[];

  @Field(() => [String])
  repos?: CeramicStreamId[];

  @Field(() => [String])
  peerProjects?: CeramicStreamId[];
}
