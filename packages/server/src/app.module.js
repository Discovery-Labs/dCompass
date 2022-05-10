"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
// import { disconnect } from './core/utils/helpers/shutdown';
var axios_1 = require("@nestjs/axios");
var graphql_1 = require("@nestjs/graphql");
var terminus_1 = require("@nestjs/terminus");
var graphql_depth_limit_1 = require("graphql-depth-limit");
var graphql_2 = require("graphql");
var config_1 = require("@nestjs/config");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var ApolloComplexity_plugin_1 = require("./core/utils/security/ApolloComplexity.plugin");
var redis_1 = require("./core/resources/Redis/redis");
var health_controller_1 = require("./core/controllers/health.controller");
var config_2 = require("./core/configs/config");
var validate_quest_completion_controller_1 = require("./core/controllers/validate-quest-completion.controller");
var Project_module_1 = require("./entities/Projects/Project.module");
var Pathway_module_1 = require("./entities/Pathways/Pathway.module");
var Quest_module_1 = require("./entities/Quests/Quest.module");
var Tag_module_1 = require("./entities/Tags/Tag.module");
var GetAppDID_resolver_1 = require("./entities/App/queries/GetAppDID.resolver");
var Prisma_service_1 = require("./services/prisma/Prisma.service");
var User_module_1 = require("./entities/Users/User.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                axios_1.HttpModule.register({
                    timeout: 60000,
                    maxRedirects: 10
                }),
                config_1.ConfigModule.forRoot({ isGlobal: true, load: [config_2["default"]] }),
                graphql_1.GraphQLModule.forRootAsync({
                    useFactory: function (configService) { return __awaiter(void 0, void 0, void 0, function () {
                        var graphqlConfig;
                        return __generator(this, function (_a) {
                            graphqlConfig = configService.get("graphql");
                            return [2 /*return*/, {
                                    cors: false,
                                    installSubscriptionHandlers: true,
                                    buildSchemaOptions: {
                                        numberScalarMode: "integer",
                                        pubSub: redis_1.pubSub
                                    },
                                    plugins: [new ApolloComplexity_plugin_1.ApolloComplexityPlugin(80)],
                                    formatError: graphql_2.formatError,
                                    validationRules: [(0, graphql_depth_limit_1["default"])(10)],
                                    sortSchema: graphqlConfig === null || graphqlConfig === void 0 ? void 0 : graphqlConfig.sortSchema,
                                    autoSchemaFile: (graphqlConfig === null || graphqlConfig === void 0 ? void 0 : graphqlConfig.schemaDestination) || "./src/schema.graphql",
                                    debug: graphqlConfig === null || graphqlConfig === void 0 ? void 0 : graphqlConfig.debug,
                                    playground: graphqlConfig === null || graphqlConfig === void 0 ? void 0 : graphqlConfig.playgroundEnabled,
                                    context: function (_a) {
                                        var req = _a.req, res = _a.res;
                                        return ({ req: req, res: res });
                                    }
                                }];
                        });
                    }); },
                    inject: [config_1.ConfigService]
                }),
                terminus_1.TerminusModule,
                Project_module_1.ProjectModule,
                Pathway_module_1.PathwayModule,
                Quest_module_1.QuestModule,
                Tag_module_1.TagModule,
                User_module_1.UserModule,
            ],
            controllers: [app_controller_1.AppController, health_controller_1.HealthController, validate_quest_completion_controller_1.CeramicController],
            providers: [app_service_1.AppService, config_1.ConfigService, GetAppDID_resolver_1.GetAppDIDResolver, Prisma_service_1.PrismaService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
// TODO: fix port already in use on hot reload
// export class AppModule implements OnApplicationShutdown {
//   async beforeApplicationShutdown(signal: string) {
//     Logger.log('before shutdown', signal); // e.g. "SIGINT"
//     await disconnect();
//     return new Promise((resolve) => {
//       setTimeout(resolve, 3000);
//     });
//   }
//   onApplicationShutdown(signal: string) {
//     Logger.log('shutting down', signal); // e.g. "SIGINT"
//     return;
//   }
// }
