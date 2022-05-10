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
exports.GetBountyQuestByIdResolver = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
var UseCeramic_decorator_1 = require("../../../core/decorators/UseCeramic.decorator");
var UseSiwe_decorator_1 = require("../../../core/decorators/UseSiwe.decorator");
var helpers_1 = require("../../../core/utils/helpers");
var BountyQuest_entity_1 = require("../BountyQuest.entity");
// type SolutionSubmission = {
//   did: string;
//   solution: string;
//   reviewComment?: string;
//   status: string;
// };
var GetBountyQuestByIdResolver = /** @class */ (function () {
    function GetBountyQuestByIdResolver(questService) {
        this.questService = questService;
    }
    GetBountyQuestByIdResolver.prototype.getBountyQuestById = function (siwe, _a, _b) {
        var ceramicClient = _a.ceramicClient, ceramicCore = _a.ceramicCore;
        var questId = _b.questId, did = _b.did;
        return __awaiter(this, void 0, void 0, function () {
            var foundQuest, pathway, project, questInfos, questCreatorDID, address, chainId, projectContributors, isProjectContributor, decryptedSolutions, parsedSubmissions;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.questService.bountyQuestWithPathwayAndProjectSquads({
                            id: questId
                        })];
                    case 1:
                        foundQuest = _c.sent();
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
                        return [4 /*yield*/, ceramicCore.ceramic.loadStream(foundQuest.streamId)];
                    case 2:
                        questInfos = _c.sent();
                        questCreatorDID = questInfos.controllers[0];
                        address = siwe.address, chainId = siwe.chainId;
                        console.log({ address: address });
                        if (!address) {
                            throw new common_1.ForbiddenException("Unauthorized");
                        }
                        projectContributors = project.squads
                            ? project.squads.flatMap(function (squad) {
                                return squad.members.map(function (m) { return m.toLowerCase(); });
                            })
                            : [];
                        isProjectContributor = projectContributors.includes(address.toLowerCase());
                        console.log({ isProjectContributor: isProjectContributor });
                        decryptedSolutions = [];
                        if (!isProjectContributor) return [3 /*break*/, 4];
                        parsedSubmissions = foundQuest.submissions.map(function (submission) { return (__assign(__assign({}, submission), { solution: JSON.parse(submission.solution) })); });
                        console.log({ parsedSubmissions: parsedSubmissions });
                        return [4 /*yield*/, Promise.all(parsedSubmissions.map(function (submission) { return __awaiter(_this, void 0, void 0, function () {
                                var decryptedSolution;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, ((_a = ceramicClient.ceramic.did) === null || _a === void 0 ? void 0 : _a.decryptDagJWE(submission.solution))];
                                        case 1:
                                            decryptedSolution = _b.sent();
                                            return [2 /*return*/, __assign(__assign({}, submission), { solution: JSON.stringify(decryptedSolution) })];
                                    }
                                });
                            }); }))];
                    case 3:
                        decryptedSolutions = _c.sent();
                        console.log({ decryptedSolutions: decryptedSolutions });
                        _c.label = 4;
                    case 4: 
                    // 3. if is project contributor then decrypt solutions otherwhise keep as is.
                    return [2 /*return*/, (0, helpers_1["default"])(__assign(__assign({}, foundQuest), { submissions: decryptedSolutions.length > 0
                                ? decryptedSolutions
                                : foundQuest.submissions || [], chainId: questInfos.content.chainId || chainId, namespace: questInfos.content.namespace, createdBy: questCreatorDID, 
                            // createdBy: {
                            //   did: questCreatorDID,
                            //   name: questCreatorBasicProfile?.name || "",
                            // },
                            isProjectContributor: isProjectContributor }))];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Query)(function () { return BountyQuest_entity_1.BountyQuest; }, {
            nullable: true,
            description: "Gets a quiz quest by its ID",
            name: "getBountyQuestById"
        }),
        __param(0, (0, UseSiwe_decorator_1.UseSiwe)()),
        __param(1, (0, UseCeramic_decorator_1.UseCeramic)()),
        __param(2, (0, graphql_1.Args)("input"))
    ], GetBountyQuestByIdResolver.prototype, "getBountyQuestById");
    GetBountyQuestByIdResolver = __decorate([
        (0, graphql_1.Resolver)(function () { return BountyQuest_entity_1.BountyQuest; })
    ], GetBountyQuestByIdResolver);
    return GetBountyQuestByIdResolver;
}());
exports.GetBountyQuestByIdResolver = GetBountyQuestByIdResolver;
