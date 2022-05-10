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
exports.SubmitQuestSolutionResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var apollo_server_express_1 = require("apollo-server-express");
var common_1 = require("@nestjs/common");
var UseSiwe_decorator_1 = require("../../../core/decorators/UseSiwe.decorator");
var SubmitQuestSolutionResolver = /** @class */ (function () {
    function SubmitQuestSolutionResolver(questService, appService) {
        this.questService = questService;
        this.appService = appService;
    }
    SubmitQuestSolutionResolver.prototype.submitQuestSolution = function (siwe, solutionSubmission) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var foundQuest, pathway, project, address, alreadySubmittedBy, alreadyCompletedBy, isQuestAlreadyCompleted, isQuestAlreadySubmitted, newSubmission;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.questService.bountyQuestWithPathwayAndProjectSquads({
                            id: solutionSubmission.questId
                        })];
                    case 1:
                        foundQuest = _b.sent();
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
                        address = siwe.address;
                        console.log({ address: address });
                        if (!address) {
                            throw new common_1.ForbiddenException("Unauthorized");
                        }
                        alreadySubmittedBy = foundQuest.submissions
                            ? foundQuest.submissions.map(function (_a) {
                                var did = _a.did;
                                return did;
                            })
                            : [];
                        alreadyCompletedBy = (_a = foundQuest.completedBy) !== null && _a !== void 0 ? _a : [];
                        isQuestAlreadyCompleted = alreadyCompletedBy.includes(solutionSubmission.did);
                        isQuestAlreadySubmitted = alreadySubmittedBy.includes(solutionSubmission.did);
                        if (isQuestAlreadySubmitted) {
                            throw new apollo_server_express_1.ForbiddenError("Quest solution already submitted");
                        }
                        if (isQuestAlreadyCompleted) {
                            throw new apollo_server_express_1.ForbiddenError("Quest already completed");
                        }
                        newSubmission = {
                            did: solutionSubmission.did,
                            solution: solutionSubmission.solution,
                            status: "under-review"
                        };
                        return [4 /*yield*/, this.questService.updateBountyQuest({
                                where: {
                                    id: foundQuest.id
                                },
                                data: {
                                    submissions: {
                                        create: newSubmission
                                    }
                                }
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Mutation)(function () { return Boolean; }, {
            nullable: false,
            description: "Submits quest solution",
            name: "submitQuestSolution"
        }),
        __param(0, (0, UseSiwe_decorator_1.UseSiwe)()),
        __param(1, (0, graphql_1.Args)("input"))
    ], SubmitQuestSolutionResolver.prototype, "submitQuestSolution");
    SubmitQuestSolutionResolver = __decorate([
        (0, graphql_1.Resolver)(function () { return Boolean; })
    ], SubmitQuestSolutionResolver);
    return SubmitQuestSolutionResolver;
}());
exports.SubmitQuestSolutionResolver = SubmitQuestSolutionResolver;
