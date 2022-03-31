import { Field, ObjectType } from '@nestjs/graphql';
import { Quest } from '../Quest.entity';

@ObjectType()
export class SubmitQuestAnswersOutput extends Quest {
  @Field(() => Boolean)
  isSuccess: boolean;
}
