"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PathwayModule = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("@nestjs/axios");
var Redis_module_1 = require("../../core/resources/Redis/Redis.module");
var CreatePathway_resolver_1 = require("./mutations/CreatePathway.resolver");
var GetAllPathwaysByProjectId_resolver_1 = require("./queries/GetAllPathwaysByProjectId.resolver");
var ApprovePathway_resolver_1 = require("./mutations/ApprovePathway.resolver");
var GetPathwayById_resolver_1 = require("./queries/GetPathwayById.resolver");
var app_service_1 = require("../../app.service");
var VerifyPathway_resolver_1 = require("./mutations/VerifyPathway.resolver");
var ClaimPathwayRewards_resolver_1 = require("./mutations/ClaimPathwayRewards.resolver");
var Prisma_service_1 = require("../../services/prisma/Prisma.service");
var Project_service_1 = require("../Projects/Project.service");
var Pathway_service_1 = require("./Pathway.service");
var PathwayModule = /** @class */ (function () {
    function PathwayModule() {
    }
    PathwayModule = __decorate([
        (0, common_1.Module)({
            imports: [
                Redis_module_1.RedisModule,
                axios_1.HttpModule.register({
                    timeout: 60000,
                    maxRedirects: 10
                }),
            ],
            providers: [
                CreatePathway_resolver_1.CreatePathwayResolver,
                ApprovePathway_resolver_1.ApprovePathwayResolver,
                GetPathwayById_resolver_1.GetPathwayByIdResolver,
                GetAllPathwaysByProjectId_resolver_1.GetAllPathwaysByProjectIdResolver,
                VerifyPathway_resolver_1.VerifyPathwayResolver,
                ClaimPathwayRewards_resolver_1.ClaimPathwayRewardsResolver,
                app_service_1.AppService,
                Project_service_1.ProjectService,
                Pathway_service_1.PathwayService,
                Prisma_service_1.PrismaService,
            ],
            exports: []
        })
    ], PathwayModule);
    return PathwayModule;
}());
exports.PathwayModule = PathwayModule;
