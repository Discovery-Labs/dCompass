"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProjectModule = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("@nestjs/axios");
var Redis_module_1 = require("../../core/resources/Redis/Redis.module");
var GetAllProjects_resolver_1 = require("./queries/GetAllProjects.resolver");
var CreateProject_resolver_1 = require("./mutations/CreateProject.resolver");
var GetProjectById_resolver_1 = require("./queries/GetProjectById.resolver");
var app_service_1 = require("../../app.service");
var ApproveProject_resolver_1 = require("./mutations/ApproveProject.resolver");
var EditProject_resolver_1 = require("./mutations/EditProject.resolver");
var CeramicProject_service_1 = require("./CeramicProject.service");
var Project_service_1 = require("./Project.service");
var Prisma_service_1 = require("../../services/prisma/Prisma.service");
var ProjectModule = /** @class */ (function () {
    function ProjectModule() {
    }
    ProjectModule = __decorate([
        (0, common_1.Module)({
            imports: [
                Redis_module_1.RedisModule,
                axios_1.HttpModule.register({
                    timeout: 60000,
                    maxRedirects: 10
                }),
            ],
            providers: [
                GetAllProjects_resolver_1.GetAllProjectsResolver,
                GetProjectById_resolver_1.GetProjectByIdResolver,
                CreateProject_resolver_1.CreateProjectResolver,
                EditProject_resolver_1.EditProjectResolver,
                ApproveProject_resolver_1.ApproveProjectResolver,
                app_service_1.AppService,
                CeramicProject_service_1.CeramicProjectService,
                Project_service_1.ProjectService,
                Prisma_service_1.PrismaService,
            ],
            exports: []
        })
    ], ProjectModule);
    return ProjectModule;
}());
exports.ProjectModule = ProjectModule;
