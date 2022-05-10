"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.SignInResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var common_1 = require("@nestjs/common");
var config_1 = require("../../../core/configs/config");
var redis_1 = require("../../../core/constants/redis");
var User_entity_1 = require("../User.entity");
var siwe_1 = require("siwe");
var ethers_1 = require("ethers");
var apollo_server_errors_1 = require("apollo-server-errors");
var networks_1 = require("../../../core/utils/helpers/networks");
var UseCeramic_decorator_1 = require("../../../core/decorators/UseCeramic.decorator");
var _a = (0, config_1["default"])(), _b = _a.api, port = _b.port, hostname = _b.hostname, protocol = _b.protocol, infuraKey = _a.infuraKey;
var SignInResolver = /** @class */ (function () {
    function SignInResolver(pubSub, userService) {
        this.pubSub = pubSub;
        this.userService = userService;
    }
    SignInResolver.prototype.signIn = function (ctx, _a, _b) {
        var ceramicCore = _a.ceramicCore;
        var ens = _b.ens, message = _b.message;
        return __awaiter(this, void 0, void 0, function () {
            var siweMsg, infuraProvider, fields, chainSpecificAddress, userDID, foundUser, createdUser, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        if (!message) {
                            throw new common_1.BadRequestException({
                                message: "Expected siwe message as input"
                            });
                        }
                        siweMsg = new siwe_1.SiweMessage(message);
                        console.log({ siweMsg: siweMsg });
                        infuraProvider = new ethers_1.providers.JsonRpcProvider({
                            allowGzip: true,
                            url: "".concat((0, networks_1.getInfuraUrl)(siweMsg.chainId), "/").concat(infuraKey),
                            headers: {
                                Accept: "*/*",
                                Origin: "".concat(protocol, "://").concat(hostname, ":").concat(port),
                                "Accept-Encoding": "gzip, deflate, br",
                                "Content-Type": "application/json"
                            }
                        }, siweMsg.chainId);
                        return [4 /*yield*/, infuraProvider.ready];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, siweMsg.validate(undefined, infuraProvider)];
                    case 2:
                        fields = _c.sent();
                        console.log({ ctxNonce: ctx.req.session.nonce });
                        if (fields.nonce !== ctx.req.session.nonce) {
                            throw new common_1.BadRequestException({
                                message: "Invalid nonce."
                            });
                        }
                        chainSpecificAddress = "".concat(fields.address, "@eip155:").concat(fields.chainId);
                        return [4 /*yield*/, ceramicCore.getAccountDID(chainSpecificAddress)];
                    case 3:
                        userDID = _c.sent();
                        return [4 /*yield*/, this.userService.users({
                                where: {
                                    OR: [
                                        {
                                            addresses: {
                                                has: chainSpecificAddress
                                            }
                                        },
                                        {
                                            did: userDID
                                        },
                                    ]
                                }
                            })];
                    case 4:
                        foundUser = (_c.sent())[0];
                        createdUser = null;
                        if (!(!foundUser && userDID)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.userService.createUser({
                                did: userDID,
                                addresses: [chainSpecificAddress]
                            })];
                    case 5:
                        createdUser = _c.sent();
                        _c.label = 6;
                    case 6:
                        ctx.req.session.siwe = fields;
                        ctx.req.session.ens = ens;
                        ctx.req.session.nonce = null;
                        if (fields.expirationTime) {
                            ctx.req.session.cookie.expires = new Date(fields.expirationTime);
                        }
                        return [4 /*yield*/, ctx.req.session.save()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, this.pubSub.publish("userSignedIn", {
                                userSignedIn: ctx.req.session.siwe.address
                            })];
                    case 8:
                        _c.sent();
                        return [2 /*return*/, {
                                addresses: [ctx.req.session.siwe.address],
                                did: ctx.req.session.ens || userDID,
                                id: (createdUser === null || createdUser === void 0 ? void 0 : createdUser.id) || foundUser.id
                            }];
                    case 9:
                        error_1 = _c.sent();
                        ctx.req.session.siwe = null;
                        ctx.req.session.nonce = null;
                        ctx.req.session.ens = null;
                        switch (error_1) {
                            case siwe_1.ErrorTypes.EXPIRED_MESSAGE: {
                                ctx.req.session.save(function () {
                                    throw new apollo_server_errors_1.ApolloError(error_1.message, "440");
                                });
                                break;
                            }
                            case siwe_1.ErrorTypes.INVALID_SIGNATURE: {
                                ctx.req.session.save(function () {
                                    throw new apollo_server_errors_1.ApolloError(error_1.message, "422");
                                });
                                break;
                            }
                            default: {
                                ctx.req.session.save(function () {
                                    throw new apollo_server_errors_1.ApolloError(error_1.message, "500");
                                });
                                break;
                            }
                        }
                        return [2 /*return*/, null];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Mutation)(function () { return User_entity_1.User || null; }, {
            description: "Sign in a user and notifies the connected clients"
        }),
        __param(0, (0, graphql_1.Context)()),
        __param(1, (0, UseCeramic_decorator_1.UseCeramic)()),
        __param(2, (0, graphql_1.Args)("input"))
    ], SignInResolver.prototype, "signIn");
    SignInResolver = __decorate([
        (0, graphql_1.Resolver)(),
        __param(0, (0, common_1.Inject)(redis_1.PUB_SUB))
    ], SignInResolver);
    return SignInResolver;
}());
exports.SignInResolver = SignInResolver;
