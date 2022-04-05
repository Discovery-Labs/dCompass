import {
  ObjectType,
  Field,
  registerEnumType,
  Float,
  Int,
} from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';
import { ExpandedServerSignature } from '../../core/utils/security/ExpandedServerSignature';
import { Quest } from '../Quests/Quest.entity';

export enum PathwayTypeEnum {
  BRANCHED = 'branched',
  DECRYPTED = 'decrypted',
}

export enum PathwayDifficultyEnum {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  WIZARD = 'wizard',
}

registerEnumType(PathwayTypeEnum, {
  name: 'PathwayTypeEnum',
  description:
    'Branched = theorical lessons and Decrypted = technical hands on lessons',
});

registerEnumType(PathwayDifficultyEnum, {
  name: 'PathwayDifficultyEnum',
  description:
    'The difficulty of a pathway, from beginner to wizard where wizard is the most difficult mode',
});

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
  rewardCurrency: string;

  @Field(() => Float)
  rewardAmount: number;

  @Field(() => Int)
  rewardUserCap: number;

  @Field(() => [String])
  prerequisites?: string[];

  @Field(() => PathwayDifficultyEnum)
  difficulty: PathwayDifficultyEnum;

  @Field(() => [Quest])
  quests?: Quest[];

  @Field(() => [ExpandedServerSignature])
  expandedServerSignatures?: ExpandedServerSignature[];

  @Field()
  createdBy: string;

  @Field(() => Boolean)
  isPending?: boolean;
}
