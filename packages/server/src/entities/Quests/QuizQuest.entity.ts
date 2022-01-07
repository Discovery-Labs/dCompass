import { ObjectType, Field } from '@nestjs/graphql';

import { Quest } from './Quest.entity';

@ObjectType()
export class QuizQuest extends Quest {
  @Field(() => [QuizQuest])
  questions: QuizQuest[];
}
