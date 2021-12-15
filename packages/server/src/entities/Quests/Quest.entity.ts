import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';
import { QuestNFT } from './dto/QuestNFT';
import { Question } from './dto/Question';
import { Badge } from '../Badges/Badge.entity';

export type CeramicStreamId = string;
@ObjectType()
export class Quest extends BaseEntity {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  badgeId: CeramicStreamId;

  @Field(() => Badge)
  badge: Badge;

  @Field(() => [String])
  completedBy?: CeramicStreamId[];

  @Field(() => [QuestNFT])
  nfts?: QuestNFT[];

  @Field(() => [Question], { nullable: true })
  questions?: Question[];
}
