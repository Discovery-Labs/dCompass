import { ObjectType, Field } from '@nestjs/graphql';
import { Quest } from './Quest.entity';

@ObjectType()
export class SnapshotVoterQuest extends Quest {
  @Field()
  proposalId: string;
}
