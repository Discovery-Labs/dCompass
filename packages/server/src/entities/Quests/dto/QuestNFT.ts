import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum RarityEnum {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

registerEnumType(RarityEnum, {
  name: 'RarityEnum',
  description:
    'Rarity of the NFT, from lowest to highest rarity: common, uncommon, epic, legendary',
});

@ObjectType()
export class QuestNFT {
  @Field()
  name: string;
  @Field()
  url: string;
  @Field(() => RarityEnum)
  rarity: RarityEnum;
  @Field(() => [String])
  claimedBy: string[];
}
