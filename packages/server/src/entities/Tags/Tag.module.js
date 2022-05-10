"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TagModule = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("@nestjs/axios");
var Redis_module_1 = require("../../core/resources/Redis/Redis.module");
var GetAllTags_resolver_1 = require("./queries/GetAllTags.resolver");
// import { CreateTagResolver } from './mutations/CreateTag.resolver';
// import { CreateTagsResolver } from './mutations/CreateTags.resolver';
var Tag_service_1 = require("./Tag.service");
var Prisma_service_1 = require("../../services/prisma/Prisma.service");
var TagModule = /** @class */ (function () {
    function TagModule() {
    }
    TagModule = __decorate([
        (0, common_1.Module)({
            imports: [
                Redis_module_1.RedisModule,
                axios_1.HttpModule.register({
                    timeout: 60000,
                    maxRedirects: 10
                }),
            ],
            providers: [
                GetAllTags_resolver_1.GetAllTagsResolver,
                // CreateTagResolver,
                // CreateTagsResolver,
                Prisma_service_1.PrismaService,
                Tag_service_1.TagService,
            ],
            exports: []
        })
    ], TagModule);
    return TagModule;
}());
exports.TagModule = TagModule;
