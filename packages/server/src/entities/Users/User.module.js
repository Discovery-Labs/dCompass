"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserModule = void 0;
var common_1 = require("@nestjs/common");
var Redis_module_1 = require("../../core/resources/Redis/Redis.module");
var Prisma_service_1 = require("../../services/prisma/Prisma.service");
var SignIn_resolver_1 = require("./mutations/SignIn.resolver");
var SignOut_resolver_1 = require("./mutations/SignOut.resolver");
var GetNonce_resolver_1 = require("./queries/GetNonce.resolver");
var Me_resolver_1 = require("./queries/Me.resolver");
var User_service_1 = require("./User.service");
// import { JoinAsContributorResolver } from "./mutations/JoinAsContributor.resolver";
// import { GetAllContributorsResolver } from "./queries/GetAllContributors.resolver";
var UserModule = /** @class */ (function () {
    function UserModule() {
    }
    UserModule = __decorate([
        (0, common_1.Module)({
            imports: [
                Redis_module_1.RedisModule,
                // HttpModule.register({
                //   timeout: 60000,
                //   maxRedirects: 10,
                // }),
            ],
            providers: [
                // JoinAsContributorResolver,
                // GetAllContributorsResolver,
                GetNonce_resolver_1.GetNonceResolver,
                Me_resolver_1.MeResolver,
                SignIn_resolver_1.SignInResolver,
                SignOut_resolver_1.SignOutResolver,
                User_service_1.UserService,
                Prisma_service_1.PrismaService,
            ],
            exports: []
        })
    ], UserModule);
    return UserModule;
}());
exports.UserModule = UserModule;
