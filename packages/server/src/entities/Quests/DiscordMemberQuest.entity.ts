import { ObjectType, Field } from '@nestjs/graphql';
import { Quest } from './Quest.entity';

@ObjectType()
export class DiscordMemberQuest extends Quest {
  @Field()
  discordGuildId: string;
}
