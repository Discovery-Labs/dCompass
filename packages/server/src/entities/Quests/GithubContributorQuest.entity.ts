import { ObjectType, Field } from '@nestjs/graphql';
import { Quest } from './Quest.entity';

@ObjectType()
export class GithubContributorQuest extends Quest {
  @Field()
  githubOrgId: string;
}
