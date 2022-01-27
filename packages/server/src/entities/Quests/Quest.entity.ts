import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';
// import { QuestNFT } from './dto/QuestNFT';
// import { Pathway } from '../Pathways/Pathway.entity';

export type CeramicStreamId = string;
@ObjectType({ isAbstract: true })
export abstract class Quest extends BaseEntity {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

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

  // @Field(() => Pathway)
  // pathway: Pathway;

  @Field(() => [String])
  completedBy?: CeramicStreamId[];

  @Field(() => Boolean)
  isPending?: boolean;

  @Field()
  image: string;
  // TODO: use this instead of image
  // @Field(() => [QuestNFT])
  // nfts?: QuestNFT[];
}
