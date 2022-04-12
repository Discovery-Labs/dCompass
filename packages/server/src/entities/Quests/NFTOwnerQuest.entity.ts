import { ObjectType, Field } from '@nestjs/graphql';

import { Quest } from './Quest.entity';

@ObjectType()
export class NFTOwnerQuest extends Quest {
  @Field()
  collectionContractAddress: string;
}
