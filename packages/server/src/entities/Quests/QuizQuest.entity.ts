import { ObjectType, Field } from '@nestjs/graphql';

import { Quest } from './Quest.entity';
import { QuizQuestion } from './QuizQuestion.entity';

@ObjectType()
export class QuizQuest extends Quest {
  @Field(() => [QuizQuestion], { nullable: true })
  questions?: QuizQuestion[];
}
