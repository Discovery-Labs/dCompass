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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.SubmitQuestAnswersResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var apollo_server_express_1 = require("apollo-server-express");
var abis_json_1 = require("@discovery-dao/hardhat/abis.json");
var UseCeramic_decorator_1 = require("../../../core/decorators/UseCeramic.decorator");
var common_1 = require("@nestjs/common");
var SubmitQuestAnswers_output_1 = require("../dto/SubmitQuestAnswers.output");
var verify_1 = require("../../../core/utils/security/verify");
var helpers_1 = require("../../../core/utils/helpers");
var UseSiwe_decorator_1 = require("../../../core/decorators/UseSiwe.decorator");
var SubmitQuestAnswersResolver = /** @class */ (function () {
    function SubmitQuestAnswersResolver(questService, appService) {
        this.questService = questService;
        this.appService = appService;
    }
    SubmitQuestAnswersResolver.prototype.submitQuestAnswers = function (siwe, _a, answerSubmition) {
        var _b;
        var ceramicClient = _a.ceramicClient;
        return __awaiter(this, void 0, void 0, function () {
            var foundQuest, pathway, project, address, chainId, decryptedQuestionAnswers, isSuccess, alreadyCompletedBy, isQuestAlreadyCompleted, chainIdStr, verifyContract, questContract, metadataNonceId, _c, r, s, v;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.questService.quizQuestWithPathwayAndProjectSquads({
                            id: answerSubmition.questId
                        })];
                    case 1:
                        foundQuest = _d.sent();
                        if (!foundQuest) {
                            throw new common_1.NotFoundException("Quest not found");
                        }
                        pathway = foundQuest.pathway;
                        if (!pathway) {
                            throw new common_1.NotFoundException("Quest has no parent pathway");
                        }
                        project = pathway.project;
                        if (!project) {
                            throw new common_1.NotFoundException("Pathway has no parent project");
                        }
                        address = siwe.address, chainId = siwe.chainId;
                        if (!address) {
                            throw new common_1.ForbiddenException("Unauthorized");
                        }
                        console.log({ foundQuest: foundQuest });
                        return [4 /*yield*/, Promise.all(foundQuest.questions.map(function (qa) { return __awaiter(_this, void 0, void 0, function () {
                                var decryptedAnswers, submittedAnswer, isCorrect;
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, ((_a = ceramicClient.ceramic.did) === null || _a === void 0 ? void 0 : _a.decryptDagJWE(JSON.parse(qa.answer)))];
                                        case 1:
                                            decryptedAnswers = _c.sent();
                                            console.log({ decryptedAnswers: decryptedAnswers });
                                            submittedAnswer = (_b = answerSubmition.questionAnswers.find(function (question) { return question.question === qa.question; })) === null || _b === void 0 ? void 0 : _b.answer;
                                            console.log({ submittedAnswer: submittedAnswer });
                                            if (!submittedAnswer || !decryptedAnswers) {
                                                return [2 /*return*/, false];
                                            }
                                            isCorrect = decryptedAnswers.every(function (answer) {
                                                return submittedAnswer.includes(answer);
                                            });
                                            return [2 /*return*/, isCorrect];
                                    }
                                });
                            }); }))];
                    case 2:
                        decryptedQuestionAnswers = _d.sent();
                        isSuccess = decryptedQuestionAnswers.every(function (answerIsCorrect) { return answerIsCorrect; });
                        console.log({ isSuccess: isSuccess });
                        if (!isSuccess) return [3 /*break*/, 6];
                        alreadyCompletedBy = (_b = foundQuest.completedBy) !== null && _b !== void 0 ? _b : [];
                        isQuestAlreadyCompleted = alreadyCompletedBy.includes(answerSubmition.did);
                        console.log({ isQuestAlreadyCompleted: isQuestAlreadyCompleted });
                        if (isQuestAlreadyCompleted) {
                            throw new apollo_server_express_1.ForbiddenError("Quest already completed");
                        }
                        return [4 /*yield*/, this.questService.updateQuizQuest({
                                where: {
                                    id: foundQuest.id
                                },
                                data: {
                                    completedBy: __spreadArray(__spreadArray([], alreadyCompletedBy, true), [answerSubmition.did], false)
                                }
                            })];
                    case 3:
                        _d.sent();
                        chainIdStr = chainId.toString();
                        if (!Object.keys(abis_json_1["default"]).includes(chainIdStr)) {
                            throw new Error("Unsupported Network");
                        }
                        verifyContract = this.appService.getContract(chainIdStr, "Verify");
                        questContract = this.appService.getContract(chainIdStr, "BadgeNFT");
                        return [4 /*yield*/, verifyContract.noncesParentIdChildId(pathway.streamId, foundQuest.streamId)];
                    case 4:
                        metadataNonceId = _d.sent();
                        return [4 /*yield*/, (0, verify_1.verifyNFTInfo)({
                                contractAddress: questContract.address,
                                nonceId: metadataNonceId,
                                objectId: foundQuest.streamId,
                                senderAddress: address,
                                verifyContract: verifyContract.address
                            })];
                    case 5:
                        _c = _d.sent(), r = _c.r, s = _c.s, v = _c.v;
                        return [2 /*return*/, (0, helpers_1["default"])(__assign(__assign({ isSuccess: isSuccess }, foundQuest), { expandedServerSignatures: [{ r: r, s: s, v: v }] }))];
                    case 6: return [2 /*return*/, (0, helpers_1["default"])(__assign({ isSuccess: isSuccess }, foundQuest))];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Mutation)(function () { return SubmitQuestAnswers_output_1.SubmitQuestAnswersOutput; }, {
            nullable: false,
            description: "Submits quest answers",
            name: "submitQuestAnswers"
        }),
        __param(0, (0, UseSiwe_decorator_1.UseSiwe)()),
        __param(1, (0, UseCeramic_decorator_1.UseCeramic)()),
        __param(2, (0, graphql_1.Args)("input"))
    ], SubmitQuestAnswersResolver.prototype, "submitQuestAnswers");
    SubmitQuestAnswersResolver = __decorate([
        (0, graphql_1.Resolver)(function () { return SubmitQuestAnswers_output_1.SubmitQuestAnswersOutput; })
    ], SubmitQuestAnswersResolver);
    return SubmitQuestAnswersResolver;
}());
exports.SubmitQuestAnswersResolver = SubmitQuestAnswersResolver;
