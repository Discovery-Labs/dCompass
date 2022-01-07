import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Quest } from './Quest.entity';

@ObjectType()
export class NFTOwnerQuest extends Quest {
  @Field()
  collectionContractAddress: string;
  @Field()
  namespace: string;
  @Field(() => Int)
  chainId: number;
}
