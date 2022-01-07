import { ObjectType, Field } from '@nestjs/graphql';
import { Quest } from './Quest.entity';

@ObjectType()
export class PoapOwnerQuest extends Quest {
  @Field()
  poapTokenId: string;
}
