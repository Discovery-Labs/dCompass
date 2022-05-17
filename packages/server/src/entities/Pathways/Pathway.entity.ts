import { ObjectType, Field, Float, Int } from "@nestjs/graphql";
import { BaseEntity } from "../../core/entities/BaseEntity";
import { ExpandedServerSignature } from "../../core/utils/security/ExpandedServerSignature";
import { BountyQuest } from "../Quests/BountyQuest.entity";
import { Quest } from "../Quests/Quest.entity";
import { QuizQuest } from "../Quests/QuizQuest.entity";

export enum PathwayTypeEnum {
  BRANCHED = "branched",
  DECRYPTED = "decrypted",
}

export type CeramicStreamId = string;
@ObjectType()
export class Pathway extends BaseEntity {
  @Field()
  id: string;

  @Field()
  streamId: string;

  @Field()
  title: string;

  @Field()
  projectId: string;

  @Field()
  projectStreamId: string;

  @Field()
  image: string;

  @Field()
  description: string;

  @Field()
  slogan: string;

  @Field({ nullable: true })
  rewardCurrency?: string;

  @Field(() => Float, { nullable: true })
  rewardAmount?: number;

  @Field(() => Int)
  rewardUserCap: number;

  @Field(() => [String])
  prerequisites?: string[];

  @Field(() => [Quest])
  quests?: Quest[];

  @Field(() => [QuizQuest])
  quizQuests?: QuizQuest[];

  @Field(() => [BountyQuest])
  bountyQuests?: BountyQuest[];

  @Field(() => [ExpandedServerSignature])
  expandedServerSignatures?: ExpandedServerSignature[];

  @Field()
  createdBy: string;

  @Field(() => Boolean)
  isPending?: boolean;
}
