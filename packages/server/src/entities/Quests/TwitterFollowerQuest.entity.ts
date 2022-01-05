import { ObjectType, Field } from '@nestjs/graphql';

import { Quest } from './Quest.entity';

@ObjectType()
export class TwitterFollowerQuest extends Quest {
  @Field(() => [String])
  twitterHandles: string[];
}
