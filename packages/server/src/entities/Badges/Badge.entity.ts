import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '../../core/entities/BaseEntity';
import { Quest } from '../Quests/Quest.entity';

export enum BadgeTypeEnum {
  BRANCHED = 'branched',
  DECRYPTED = 'decrypted',
}

export enum BadgeDifficultyEnum {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  WIZARD = 'wizard',
}

registerEnumType(BadgeTypeEnum, {
  name: 'BadgeTypeEnum',
  description:
    'Branched = theorical lessons and Decrypted = technical hands on lessons',
});

registerEnumType(BadgeDifficultyEnum, {
  name: 'BadgeDifficultyEnum',
  description:
    'The difficulty of a badge, from beginner to wizard where wizard is the most difficult mode',
});

export type CeramicStreamId = string;
@ObjectType()
export class Badge extends BaseEntity {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  projectId: string;

  @Field()
  image: string;

  @Field()
  description: string;

  @Field(() => [String])
  prerequisites?: string[];

  @Field(() => BadgeDifficultyEnum)
  difficulty: BadgeDifficultyEnum;

  @Field(() => [Quest])
  quests?: Quest[];

  @Field(() => Boolean)
  isPending?: boolean;
}
