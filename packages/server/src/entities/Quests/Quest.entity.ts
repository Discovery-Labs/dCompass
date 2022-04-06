import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';
import { ExpandedServerSignature } from '../../core/utils/security/ExpandedServerSignature';
import { Pathway } from '../Pathways/Pathway.entity';

export type CeramicStreamId = string;
@ObjectType({ isAbstract: true })
export abstract class Quest extends BaseEntity {
  @Field()
  id: string;

  @Field()
  streamId: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  slogan: string;

  @Field()
  questType: string;

  @Field()
  rewardCurrency: string;

  @Field(() => Float)
  rewardAmount: number;

  @Field(() => Int)
  rewardUserCap: number;

  @Field()
  pathwayId: CeramicStreamId;

  @Field(() => Pathway)
  pathway: Pathway;

  @Field(() => [String])
  completedBy?: CeramicStreamId[];

  @Field(() => Boolean)
  isPending?: boolean;

  @Field()
  image: string;

  @Field(() => [ExpandedServerSignature])
  expandedServerSignatures?: ExpandedServerSignature[];
}
