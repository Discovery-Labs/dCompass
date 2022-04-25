import { ObjectType, Field } from '@nestjs/graphql';
import { SolutionSubmission } from './dto/SolutionSubmission';

import { Quest } from './Quest.entity';

@ObjectType()
export class BountyQuest extends Quest {
    @Field(() => [SolutionSubmission], { defaultValue: [] })
    submissions: SolutionSubmission[];
}
