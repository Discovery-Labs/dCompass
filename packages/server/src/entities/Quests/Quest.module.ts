// import { Module } from '@nestjs/common';
// import { HttpModule } from '@nestjs/axios';

// import { RedisModule } from '../../core/resources/Redis/Redis.module';

// import { GetAllQuestsResolver } from './queries/GetAllQuests.resolver';
// import { CreateQuestResolver } from './mutations/CreateQuest.resolver';
// import { GetQuestByIdResolver } from './queries/GetQuestById.resolver';
// import { SubmitQuestAnswersResolver } from './mutations/SubmitQuestAnswers.resolver';

// @Module({
//   imports: [
//     RedisModule,
//     HttpModule.register({
//       timeout: 60000,
//       maxRedirects: 10,
//     }),
//   ],
//   providers: [
//     GetAllQuestsResolver,
//     CreateQuestResolver,
//     GetQuestByIdResolver,
//     SubmitQuestAnswersResolver,
//   ],
//   exports: [],
// })
// export class QuestModule {}
