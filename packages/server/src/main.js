"use strict";
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
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// import cookieParser from 'cookie-parser';
var core_1 = require("@nestjs/core");
var app_module_1 = require("./app.module");
var common_1 = require("@nestjs/common");
var config_1 = require("./core/configs/config");
// import { makeCeramicClient } from './services/ceramic/ceramic.service';
var swagger_1 = require("@nestjs/swagger");
var config_2 = require("@nestjs/config");
var data_models_1 = require("./services/ceramic/data-models");
var redis_1 = require("./core/resources/Redis/redis");
// import { PrismaService } from "./services/prisma/Prisma.service";
var _a = (0, config_1["default"])().api, protocol = _a.protocol, hostname = _a.hostname, port = _a.port, corsOptions = _a.corsOptions;
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, ceramicClient, configService, swaggerConfig, options, document_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule, {
                        bodyParser: true,
                        cors: false
                    })];
                case 1:
                    app = _a.sent();
                    app.enableCors(corsOptions);
                    app.disable("x-powered-by");
                    // if we add cloudflare on a proxy
                    // app.set('trust proxy', 1); // trust first proxy
                    // enable shutdown hooks
                    // const prismaService = app.get(PrismaService);
                    // await prismaService.enableShutdownHooks(app);
                    app.enableShutdownHooks(["SIGINT", "SIGTERM"]);
                    app.use(redis_1.sessionMiddleware);
                    return [4 /*yield*/, (0, data_models_1.ceramicDataModelFactory)()];
                case 2:
                    ceramicClient = _a.sent();
                    // app.use(cookieParser(sessionOptions.secret));
                    // app.use(sessionMiddleware);
                    /* Cookie & Session cleaner */
                    // app.use((req: Context['req'], res: Context['res'], next: NextFunction) => {
                    //   if (req.cookies[sessionOptions.name] && !req.session?.userId) {
                    //     res.clearCookie(sessionOptions.name);
                    //   }
                    //   next();
                    // });
                    app.use(function (req, _res, next) { return __awaiter(_this, void 0, void 0, function () {
                        var ceramicCore;
                        return __generator(this, function (_a) {
                            ceramicCore = (0, data_models_1.ceramicCoreFactory)();
                            req.ceramicClient = ceramicClient;
                            req.ceramicCore = ceramicCore;
                            next();
                            return [2 /*return*/];
                        });
                    }); });
                    configService = app.get(config_2.ConfigService);
                    swaggerConfig = configService.get("swagger");
                    // Swagger Api
                    if (swaggerConfig === null || swaggerConfig === void 0 ? void 0 : swaggerConfig.enabled) {
                        options = new swagger_1.DocumentBuilder()
                            .setTitle(swaggerConfig.title || "Nestjs")
                            .setDescription(swaggerConfig.description || "The nestjs API description")
                            .setVersion(swaggerConfig.version || "1.0")
                            .build();
                        document_1 = swagger_1.SwaggerModule.createDocument(app, options);
                        swagger_1.SwaggerModule.setup(swaggerConfig.path || "api", app, document_1);
                    }
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        validationError: {
                            target: false,
                            value: true
                        },
                        exceptionFactory: function (errors) {
                            return new common_1.BadRequestException(errors);
                        },
                        forbidNonWhitelisted: true
                    }));
                    return [4 /*yield*/, app.listen(port, function () {
                            common_1.Logger.log("".concat(protocol(), "://").concat(hostname, "/health"), "REST API");
                            common_1.Logger.log("".concat(protocol(), "://").concat(hostname, "/graphql"), "GraphQL API");
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
