import {
  ObjectType,
  Field,
  Float,
  Int,
  registerEnumType,
} from "@nestjs/graphql";
import { BaseEntity } from "../../core/entities/BaseEntity";
import { ExpandedServerSignature } from "../../core/utils/security/ExpandedServerSignature";
// TODO: eventually query the basic profile of the creator
// import { CreatedBy } from "./dto/CreatedBy";

export enum QuestDifficultyEnum {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
  WIZARD = "WIZARD",
}

registerEnumType(QuestDifficultyEnum, {
  name: "QuestDifficultyEnum",
  description:
    "The difficulty of a quest, from beginner to wizard where wizard is the most difficult mode",
});
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

  @Field(() => QuestDifficultyEnum)
  difficulty: QuestDifficultyEnum;

  @Field()
  slogan: string;

  @Field()
  questType: string;

  @Field()
  createdBy: string;

  @Field({ nullable: true })
  rewardCurrency?: string;

  @Field(() => Float, { nullable: true })
  rewardAmount?: number;

  @Field(() => Int)
  rewardUserCap: number;

  @Field()
  pathwayId: string;

  @Field(() => [String])
  prerequisites?: string[];

  @Field(() => [String], { defaultValue: [] })
  completedBy?: string[];

  @Field(() => Boolean)
  isPending?: boolean;

  @Field()
  namespace?: string;

  @Field(() => Int)
  chainId: number;

  @Field()
  image: string;

  @Field(() => [ExpandedServerSignature])
  expandedServerSignatures?: ExpandedServerSignature[];
}
