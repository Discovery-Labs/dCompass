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
exports.ClaimPathwayRewardsResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var abis_json_1 = require("@discovery-dao/hardhat/abis.json");
var verify_1 = require("../../../core/utils/security/verify");
var common_1 = require("@nestjs/common");
var UseCeramic_decorator_1 = require("../../../core/decorators/UseCeramic.decorator");
var apollo_server_express_1 = require("apollo-server-express");
var Pathway_entity_1 = require("../Pathway.entity");
var helpers_1 = require("../../../core/utils/helpers");
var UseSiwe_decorator_1 = require("../../../core/decorators/UseSiwe.decorator");
var ClaimPathwayRewardsResolver = /** @class */ (function () {
    function ClaimPathwayRewardsResolver(appService, pathwayService) {
        this.appService = appService;
        this.pathwayService = pathwayService;
    }
    ClaimPathwayRewardsResolver.prototype.claimPathwayRewards = function (siwe, _a, _b) {
        var ceramicClient = _a.ceramicClient;
        var pathwayId = _b.pathwayId, did = _b.did;
        return __awaiter(this, void 0, void 0, function () {
            var foundPathway, project, address, chainId, adventurerAccounts, formattedAccounts, allQuests, totalQuestCount, completedQuestCount, ratio, isCompleted, chainIdStr, pathwayContract, metadataNonceId, _c, r, s, v;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.pathwayService.pathwayWithQuestsAndProjectInfos({
                            id: pathwayId
                        })];
                    case 1:
                        foundPathway = _d.sent();
                        if (!foundPathway) {
                            throw new common_1.NotFoundException("Pathway not found by back-end");
                        }
                        project = foundPathway.project;
                        if (!project) {
                            throw new common_1.NotFoundException("Pathway has no parent project!");
                        }
                        address = siwe.address, chainId = siwe.chainId;
                        if (!address) {
                            throw new common_1.ForbiddenException("Unauthorized");
                        }
                        return [4 /*yield*/, ceramicClient.dataStore.get("cryptoAccounts", did)];
                    case 2:
                        adventurerAccounts = _d.sent();
                        if (!adventurerAccounts)
                            throw new apollo_server_express_1.ForbiddenError("Unauthorized");
                        formattedAccounts = Object.keys(adventurerAccounts).map(function (account) { return account.split("@")[0]; });
                        if (!formattedAccounts.includes(address)) {
                            throw new apollo_server_express_1.ForbiddenError("Unauthorized");
                        }
                        allQuests = __spreadArray(__spreadArray([], foundPathway.quizQuests, true), foundPathway.bountyQuests, true);
                        if (!(allQuests === null || allQuests === void 0 ? void 0 : allQuests.length)) {
                            throw new apollo_server_express_1.ForbiddenError("No quests yet");
                        }
                        totalQuestCount = allQuests.length;
                        completedQuestCount = allQuests.filter(function (q) { return q.completedBy && q.completedBy.includes(did); }).length;
                        ratio = (completedQuestCount / totalQuestCount) * 100;
                        console.log({ totalQuestCount: totalQuestCount, completedQuestCount: completedQuestCount, ratio: ratio });
                        isCompleted = ratio === 100;
                        if (!isCompleted) {
                            throw new apollo_server_express_1.ForbiddenError("Pathway not completed yet!");
                        }
                        chainIdStr = chainId.toString();
                        if (!Object.keys(abis_json_1["default"]).includes(chainIdStr)) {
                            throw new Error("Unsupported Network");
                        }
                        pathwayContract = this.appService.getContract(chainIdStr, "PathwayNFT");
                        return [4 /*yield*/, pathwayContract.nonces(foundPathway.streamId, address)];
                    case 3:
                        metadataNonceId = _d.sent();
                        console.log({ metadataNonceId: metadataNonceId });
                        return [4 /*yield*/, (0, verify_1.verifyAdventurerClaimInfo)({
                                contractAddress: pathwayContract.address,
                                nonceId: metadataNonceId,
                                objectId: foundPathway.streamId,
                                senderAddress: address,
                                chainId: chainId,
                                verifyContract: pathwayContract.address
                            })];
                    case 4:
                        _c = _d.sent(), r = _c.r, s = _c.s, v = _c.v;
                        return [2 /*return*/, (0, helpers_1["default"])(__assign(__assign({}, foundPathway), { id: pathwayId, expandedServerSignatures: [{ r: r, s: s, v: v }] }))];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Mutation)(function () { return Pathway_entity_1.Pathway; }, {
            nullable: true,
            description: "Verify a new Pathway right before minting in dCompass",
            name: "claimPathwayRewards"
        }),
        __param(0, (0, UseSiwe_decorator_1.UseSiwe)()),
        __param(1, (0, UseCeramic_decorator_1.UseCeramic)()),
        __param(2, (0, graphql_1.Args)("input"))
    ], ClaimPathwayRewardsResolver.prototype, "claimPathwayRewards");
    ClaimPathwayRewardsResolver = __decorate([
        (0, graphql_1.Resolver)(function () { return Pathway_entity_1.Pathway; })
    ], ClaimPathwayRewardsResolver);
    return ClaimPathwayRewardsResolver;
}());
exports.ClaimPathwayRewardsResolver = ClaimPathwayRewardsResolver;
