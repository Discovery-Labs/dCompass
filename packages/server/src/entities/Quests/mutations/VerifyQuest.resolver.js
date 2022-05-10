"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.VerifyQuestResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var abis_json_1 = require("@discovery-dao/hardhat/abis.json");
var common_1 = require("@nestjs/common");
var Quest_entity_1 = require("../Quest.entity");
var verify_1 = require("../../../core/utils/security/verify");
var helpers_1 = require("../../../core/utils/helpers");
var UseSiwe_decorator_1 = require("../../../core/decorators/UseSiwe.decorator");
var VerifyQuestResolver = /** @class */ (function () {
    function VerifyQuestResolver(appService, questService) {
        this.appService = appService;
        this.questService = questService;
    }
    VerifyQuestResolver.prototype.verifyQuest = function (siwe, _a) {
        var id = _a.id, questType = _a.questType;
        return __awaiter(this, void 0, void 0, function () {
            var foundQuest, address, chainId, pathway, project, projectContributors, chainIdStr, verifyContract, questContract, _b, metadataNonceId, thresholdNonceId, _c, metadataVerify, tresholdVerify;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        foundQuest = null;
                        if (!(questType === "quiz")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.questService.quizQuestWithPathwayAndProjectSquads({
                                id: id
                            })];
                    case 1:
                        foundQuest = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!(questType === "bounty")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.questService.bountyQuestWithPathwayAndProjectSquads({
                                id: id
                            })];
                    case 3:
                        foundQuest =
                            _d.sent();
                        _d.label = 4;
                    case 4:
                        if (!foundQuest) {
                            throw new common_1.NotFoundException("Quest not found by back-end");
                        }
                        address = siwe.address, chainId = siwe.chainId;
                        pathway = foundQuest.pathway;
                        if (!pathway) {
                            throw new common_1.NotFoundException("Quest has no parent pathway");
                        }
                        project = pathway.project;
                        if (!project) {
                            throw new common_1.NotFoundException("Pathway has no parent project");
                        }
                        // TODO: Keep track of address & network to avoid impersonation
                        console.log({ address: address });
                        projectContributors = project.squads
                            ? project.squads.flatMap(function (squad) {
                                return squad.members.map(function (m) { return m.toLowerCase(); });
                            })
                            : [];
                        if (!projectContributors.includes(address.toLowerCase())) {
                            throw new common_1.ForbiddenException("Unauthorized");
                        }
                        chainIdStr = chainId.toString();
                        if (!Object.keys(abis_json_1["default"]).includes(chainIdStr)) {
                            throw new Error("Unsupported Network");
                        }
                        verifyContract = this.appService.getContract(chainIdStr, "Verify");
                        questContract = this.appService.getContract(chainIdStr, "BadgeNFT");
                        return [4 /*yield*/, Promise.all([
                                verifyContract.noncesParentIdChildId(pathway.streamId, foundQuest.streamId),
                                verifyContract.thresholdNoncesById(foundQuest.streamId),
                            ])];
                    case 5:
                        _b = _d.sent(), metadataNonceId = _b[0], thresholdNonceId = _b[1];
                        return [4 /*yield*/, Promise.all([
                                (0, verify_1.verifyNFTInfo)({
                                    contractAddress: questContract.address,
                                    nonceId: metadataNonceId,
                                    objectId: foundQuest.streamId,
                                    senderAddress: address,
                                    verifyContract: verifyContract.address
                                }),
                                (0, verify_1.verifyNFTInfo)({
                                    contractAddress: questContract.address,
                                    nonceId: thresholdNonceId,
                                    objectId: foundQuest.streamId,
                                    senderAddress: address,
                                    verifyContract: verifyContract.address,
                                    votesNeeded: 1
                                }),
                            ])];
                    case 6:
                        _c = _d.sent(), metadataVerify = _c[0], tresholdVerify = _c[1];
                        return [2 /*return*/, (0, helpers_1["default"])(__assign(__assign({}, foundQuest), { expandedServerSignatures: [
                                    { r: metadataVerify.r, s: metadataVerify.s, v: metadataVerify.v },
                                    { r: tresholdVerify.r, s: tresholdVerify.s, v: tresholdVerify.v },
                                ] }))];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Mutation)(function () { return Quest_entity_1.Quest; }, {
            nullable: true,
            description: "Verify a new Quest right before minting in dCompass",
            name: "verifyQuest"
        }),
        __param(0, (0, UseSiwe_decorator_1.UseSiwe)()),
        __param(1, (0, graphql_1.Args)("input"))
    ], VerifyQuestResolver.prototype, "verifyQuest");
    VerifyQuestResolver = __decorate([
        (0, graphql_1.Resolver)(function () { return Quest_entity_1.Quest; })
    ], VerifyQuestResolver);
    return VerifyQuestResolver;
}());
exports.VerifyQuestResolver = VerifyQuestResolver;
