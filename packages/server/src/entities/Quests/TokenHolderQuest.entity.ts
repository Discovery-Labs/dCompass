import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Quest } from './Quest.entity';

@ObjectType()
export class TokenHolderQuest extends Quest {
  @Field(() => Int)
  amount: number;

  @Field()
  tokenContractAddress: string;
}
