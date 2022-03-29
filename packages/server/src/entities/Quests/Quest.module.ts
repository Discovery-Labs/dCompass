import { Module } from '@nestjs/common';
import { AppService } from '../../app.service';

import { RedisModule } from '../../core/resources/Redis/Redis.module';
import { ThreadDBService } from '../../services/thread-db/thread-db.service';
import { ApproveQuestResolver } from './mutations/ApproveQuest.resolver';
import { CreateGithubContributorQuestResolver } from './mutations/CreateGithubContributorQuest.resolver';
import { CreateNFTOwnerQuestResolver } from './mutations/CreateNFTOwnerQuest.resolver';
import { CreateQuizQuestResolver } from './mutations/CreateQuizQuest.resolver';

// import { GetAllQuestsResolver } from './queries/GetAllQuests.resolver';
// import { CreateQuestResolver } from './mutations/CreateQuest.resolver';
// import { GetQuestByIdResolver } from './queries/GetQuestById.resolver';
// import { SubmitQuestAnswersResolver } from './mutations/SubmitQuestAnswers.resolver';
import { CreateSnapshotVoterQuestResolver } from './mutations/CreateSnapshotVoterQuest.resolver';
import { SubmitQuestAnswersResolver } from './mutations/SubmitQuestAnswers.resolver';
import { VerifyQuestResolver } from './mutations/VerifyQuest.resolver';
import { GetAllQuestsByPathwayIdResolver } from './queries/GetAllQuestsByPathwayId.resolver';
import { GetQuizQuestByIdResolver } from './queries/GetQuizQuestById.resolver';

@Module({
  imports: [RedisModule],
  providers: [
    CreateSnapshotVoterQuestResolver,
    CreateGithubContributorQuestResolver,
    CreateNFTOwnerQuestResolver,
    CreateQuizQuestResolver,
    ApproveQuestResolver,
    VerifyQuestResolver,
    GetAllQuestsByPathwayIdResolver,
    GetQuizQuestByIdResolver,
    SubmitQuestAnswersResolver,
    ThreadDBService,
    AppService,
    // CreateQuestResolver,
    // GetQuestByIdResolver,
  ],
  exports: [],
})
export class QuestModule {}
