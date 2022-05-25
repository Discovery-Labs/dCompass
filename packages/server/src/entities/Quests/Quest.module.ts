import { Module } from "@nestjs/common";
import { AppService } from "../../app.service";

import { RedisModule } from "../../core/resources/Redis/Redis.module";
import { PrismaService } from "../../services/prisma/Prisma.service";

import { PathwayService } from "../Pathways/Pathway.service";
import { ApproveQuestResolver } from "./mutations/ApproveQuest.resolver";
import { ApproveQuestSolutionResolver } from "./mutations/ApproveQuestSolution.resolver";
import { ClaimQuestRewardsResolver } from "./mutations/ClaimQuestRewards.resolver";

import { CreateQuestResolver } from "./mutations/CreateQuest.resolver";
import { CreateQuizQuestResolver } from "./mutations/CreateQuizQuest.resolver";
import { EditQuestResolver } from "./mutations/EditQuest.resolver";

// import { GetAllQuestsResolver } from './queries/GetAllQuests.resolver';
// import { CreateQuestResolver } from './mutations/CreateQuest.resolver';
// import { GetQuestByIdResolver } from './queries/GetQuestById.resolver';
// import { SubmitQuestAnswersResolver } from './mutations/SubmitQuestAnswers.resolver';

import { SubmitQuestAnswersResolver } from "./mutations/SubmitQuestAnswers.resolver";
import { SubmitQuestSolutionResolver } from "./mutations/SubmitQuestSolution.resolver";
import { VerifyQuestResolver } from "./mutations/VerifyQuest.resolver";
import { GetAllQuestsByPathwayIdResolver } from "./queries/GetAllQuestsByPathwayId.resolver";
import { GetBountyQuestByIdResolver } from "./queries/GetBountyQuestById.resolver";
import { GetQuizQuestByIdResolver } from "./queries/GetQuizQuestById.resolver";
import { QuestService } from "./Quest.service";

@Module({
  imports: [RedisModule],
  providers: [
    CreateQuizQuestResolver,
    CreateQuestResolver,
    ApproveQuestResolver,
    VerifyQuestResolver,
    GetAllQuestsByPathwayIdResolver,
    GetQuizQuestByIdResolver,
    SubmitQuestAnswersResolver,
    SubmitQuestSolutionResolver,
    AppService,
    ClaimQuestRewardsResolver,
    GetBountyQuestByIdResolver,
    ApproveQuestSolutionResolver,
    PrismaService,
    PathwayService,
    QuestService,
    EditQuestResolver,
    // CreateQuestResolver,
    // GetQuestByIdResolver,
  ],
  exports: [],
})
export class QuestModule {}
