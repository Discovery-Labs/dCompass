import { Module } from '@nestjs/common';

import { RedisModule } from '../../core/resources/Redis/Redis.module';

// import { GetAllQuestsResolver } from './queries/GetAllQuests.resolver';
// import { CreateQuestResolver } from './mutations/CreateQuest.resolver';
// import { GetQuestByIdResolver } from './queries/GetQuestById.resolver';
// import { SubmitQuestAnswersResolver } from './mutations/SubmitQuestAnswers.resolver';
import { CreateSnapshotVoterQuestResolver } from './mutations/CreateSnapshotVoterQuest.resolver';

@Module({
  imports: [RedisModule],
  providers: [
    CreateSnapshotVoterQuestResolver,
    // CreateQuestResolver,
    // GetQuestByIdResolver,
    // SubmitQuestAnswersResolver,
  ],
  exports: [],
})
export class QuestModule {}
