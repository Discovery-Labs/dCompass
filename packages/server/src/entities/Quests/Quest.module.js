"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.QuestModule = void 0;
var common_1 = require("@nestjs/common");
var app_service_1 = require("../../app.service");
var Redis_module_1 = require("../../core/resources/Redis/Redis.module");
var Prisma_service_1 = require("../../services/prisma/Prisma.service");
var Pathway_service_1 = require("../Pathways/Pathway.service");
var ApproveQuest_resolver_1 = require("./mutations/ApproveQuest.resolver");
var ApproveQuestSolution_resolver_1 = require("./mutations/ApproveQuestSolution.resolver");
var ClaimQuestRewards_resolver_1 = require("./mutations/ClaimQuestRewards.resolver");
var CreateQuest_resolver_1 = require("./mutations/CreateQuest.resolver");
var CreateQuizQuest_resolver_1 = require("./mutations/CreateQuizQuest.resolver");
// import { GetAllQuestsResolver } from './queries/GetAllQuests.resolver';
// import { CreateQuestResolver } from './mutations/CreateQuest.resolver';
// import { GetQuestByIdResolver } from './queries/GetQuestById.resolver';
// import { SubmitQuestAnswersResolver } from './mutations/SubmitQuestAnswers.resolver';
var SubmitQuestAnswers_resolver_1 = require("./mutations/SubmitQuestAnswers.resolver");
var SubmitQuestSolution_resolver_1 = require("./mutations/SubmitQuestSolution.resolver");
var VerifyQuest_resolver_1 = require("./mutations/VerifyQuest.resolver");
var GetAllQuestsByPathwayId_resolver_1 = require("./queries/GetAllQuestsByPathwayId.resolver");
var GetBountyQuestById_resolver_1 = require("./queries/GetBountyQuestById.resolver");
var GetQuizQuestById_resolver_1 = require("./queries/GetQuizQuestById.resolver");
var Quest_service_1 = require("./Quest.service");
var QuestModule = /** @class */ (function () {
    function QuestModule() {
    }
    QuestModule = __decorate([
        (0, common_1.Module)({
            imports: [Redis_module_1.RedisModule],
            providers: [
                CreateQuizQuest_resolver_1.CreateQuizQuestResolver,
                CreateQuest_resolver_1.CreateQuestResolver,
                ApproveQuest_resolver_1.ApproveQuestResolver,
                VerifyQuest_resolver_1.VerifyQuestResolver,
                GetAllQuestsByPathwayId_resolver_1.GetAllQuestsByPathwayIdResolver,
                GetQuizQuestById_resolver_1.GetQuizQuestByIdResolver,
                SubmitQuestAnswers_resolver_1.SubmitQuestAnswersResolver,
                SubmitQuestSolution_resolver_1.SubmitQuestSolutionResolver,
                app_service_1.AppService,
                ClaimQuestRewards_resolver_1.ClaimQuestRewardsResolver,
                GetBountyQuestById_resolver_1.GetBountyQuestByIdResolver,
                ApproveQuestSolution_resolver_1.ApproveQuestSolutionResolver,
                Prisma_service_1.PrismaService,
                Pathway_service_1.PathwayService,
                Quest_service_1.QuestService,
                // CreateQuestResolver,
                // GetQuestByIdResolver,
            ],
            exports: []
        })
    ], QuestModule);
    return QuestModule;
}());
exports.QuestModule = QuestModule;
