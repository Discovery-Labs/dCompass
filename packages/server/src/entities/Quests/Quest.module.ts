import { Module } from '@nestjs/common';

import { RedisModule } from '../../core/resources/Redis/Redis.module';
import { ApproveQuestResolver } from './mutations/ApproveQuest.resolver';
import { CreateNFTOwnerQuestResolver } from './mutations/CreateNFTOwnerQuest.resolver';
import { CreateQuizQuestResolver } from './mutations/CreateQuizQuest.resolver';

// import { GetAllQuestsResolver } from './queries/GetAllQuests.resolver';
// import { CreateQuestResolver } from './mutations/CreateQuest.resolver';
// import { GetQuestByIdResolver } from './queries/GetQuestById.resolver';
// import { SubmitQuestAnswersResolver } from './mutations/SubmitQuestAnswers.resolver';
import { CreateSnapshotVoterQuestResolver } from './mutations/CreateSnapshotVoterQuest.resolver';
import { GetAllQuestsByPathwayIdResolver } from './queries/GetAllQuestsByPathwayId.resolver';

@Module({
  imports: [RedisModule],
  providers: [
    CreateSnapshotVoterQuestResolver,
    CreateNFTOwnerQuestResolver,
    CreateQuizQuestResolver,
    ApproveQuestResolver,
    GetAllQuestsByPathwayIdResolver,
    // CreateQuestResolver,
    // GetQuestByIdResolver,
    // SubmitQuestAnswersResolver,
  ],
  exports: [],
})
export class QuestModule {}
