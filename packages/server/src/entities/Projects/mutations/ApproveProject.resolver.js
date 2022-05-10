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
exports.ApproveProjectResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var apollo_server_errors_1 = require("apollo-server-errors");
var common_1 = require("@nestjs/common");
var Project_entity_1 = require("../Project.entity");
var helpers_1 = require("../../../core/utils/helpers");
var UseSiwe_decorator_1 = require("../../../core/decorators/UseSiwe.decorator");
var ApproveProjectResolver = /** @class */ (function () {
    function ApproveProjectResolver(appService, projectService) {
        this.appService = appService;
        this.projectService = projectService;
    }
    ApproveProjectResolver.prototype.approveProject = function (siwe, _a) {
        var id = _a.id, tokenUris = _a.tokenUris;
        return __awaiter(this, void 0, void 0, function () {
            var foundProject, address, chainId, projectNFTContract, isReviewer, statusId, status, isApproved, updatedProject;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.projectService.project({ id: id })];
                    case 1:
                        foundProject = _b.sent();
                        if (!foundProject) {
                            throw new common_1.NotFoundException("Project not found");
                        }
                        address = siwe.address, chainId = siwe.chainId;
                        projectNFTContract = this.appService.getContract(chainId.toString(), "ProjectNFT");
                        return [4 /*yield*/, projectNFTContract.reviewers(address)];
                    case 2:
                        isReviewer = _b.sent();
                        console.log({ isReviewer: isReviewer });
                        if (!isReviewer) {
                            throw new apollo_server_errors_1.ForbiddenError("Unauthorized");
                        }
                        return [4 /*yield*/, projectNFTContract.status(foundProject.streamId)];
                    case 3:
                        statusId = _b.sent();
                        return [4 /*yield*/, projectNFTContract.statusStrings(statusId)];
                    case 4:
                        status = _b.sent();
                        isApproved = status === "APPROVED";
                        if (!isApproved) {
                            throw new Error("Project not approved yet on-chain");
                        }
                        return [4 /*yield*/, this.projectService.updateProject({
                                where: {
                                    id: foundProject.id
                                },
                                data: __assign(__assign({}, foundProject), { isFeatured: isApproved, tokenUris: tokenUris })
                            })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, this.projectService.projectWithSquadsAndTags({
                                id: foundProject.id
                            })];
                    case 6:
                        updatedProject = _b.sent();
                        return [2 /*return*/, (0, helpers_1["default"])(updatedProject)];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Mutation)(function () { return Project_entity_1.Project; }, {
            nullable: true,
            description: "Approves a new Project in dCompass",
            name: "approveProject"
        }),
        __param(0, (0, UseSiwe_decorator_1.UseSiwe)()),
        __param(1, (0, graphql_1.Args)("input"))
    ], ApproveProjectResolver.prototype, "approveProject");
    ApproveProjectResolver = __decorate([
        (0, graphql_1.Resolver)(function () { return Project_entity_1.Project; })
    ], ApproveProjectResolver);
    return ApproveProjectResolver;
}());
exports.ApproveProjectResolver = ApproveProjectResolver;
