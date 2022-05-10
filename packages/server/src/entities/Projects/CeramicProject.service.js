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
exports.CeramicProjectService = void 0;
var common_1 = require("@nestjs/common");
var idx_1 = require("../../core/constants/idx");
var CeramicProjectService = /** @class */ (function () {
    function CeramicProjectService() {
    }
    CeramicProjectService.prototype.getAllProjects = function (ceramicClient) {
        return __awaiter(this, void 0, void 0, function () {
            var allProjects, projectIds, projectsWithDetails, serializedProjects;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ceramicClient.dataStore.get(idx_1.schemaAliases.APP_PROJECTS_ALIAS)];
                    case 1:
                        allProjects = _a.sent();
                        if (!(allProjects === null || allProjects === void 0 ? void 0 : allProjects.projects)) {
                            return [2 /*return*/, undefined];
                        }
                        projectIds = allProjects === null || allProjects === void 0 ? void 0 : allProjects.projects.map(function (_a) {
                            var id = _a.id;
                            return ({
                                streamId: id
                            });
                        });
                        return [4 /*yield*/, ceramicClient.ceramic.multiQuery(projectIds)];
                    case 2:
                        projectsWithDetails = _a.sent();
                        return [4 /*yield*/, Promise.all(Object.values(projectsWithDetails).map(function (stream) { return __awaiter(_this, void 0, void 0, function () {
                                var additionalFields, projectTags;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            additionalFields = allProjects.projects.find(function (_a) {
                                                var id = _a.id;
                                                return id === stream.id.toUrl();
                                            });
                                            return [4 /*yield*/, ceramicClient.ceramic.multiQuery(stream.content.tags.map(function (tag) { return ({
                                                    streamId: tag.id
                                                }); }))];
                                        case 1:
                                            projectTags = _a.sent();
                                            return [2 /*return*/, __assign(__assign(__assign({ id: stream.id.toUrl() }, stream.state.content), additionalFields), { tags: Object.entries(projectTags).map(function (_a) {
                                                        var streamId = _a[0], document = _a[1];
                                                        return (__assign({ id: streamId }, document.content));
                                                    }) })];
                                    }
                                });
                            }); }))];
                    case 3:
                        serializedProjects = _a.sent();
                        return [2 /*return*/, serializedProjects];
                }
            });
        });
    };
    CeramicProjectService.prototype.getProjectById = function (ceramicClient, projectId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var allProjects, projects, ogProject, additionalFields, projectTags;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ceramicClient.dataStore.get(idx_1.schemaAliases.APP_PROJECTS_ALIAS)];
                    case 1:
                        allProjects = _b.sent();
                        projects = (_a = allProjects.projects) !== null && _a !== void 0 ? _a : [];
                        return [4 /*yield*/, ceramicClient.ceramic.loadStream(projectId)];
                    case 2:
                        ogProject = _b.sent();
                        additionalFields = projects.find(function (_a) {
                            var id = _a.id;
                            return id === projectId;
                        });
                        return [4 /*yield*/, ceramicClient.ceramic.multiQuery(ogProject.content.tags.map(function (tag) { return ({
                                streamId: tag.id
                            }); }))];
                    case 3:
                        projectTags = _b.sent();
                        if (!ogProject || !additionalFields) {
                            return [2 /*return*/, null];
                        }
                        // const projectPathways = record.state.next?.content.pathways;
                        // console.log(projectPathways);
                        // if (projectPathways && projectPathways.length > 0) {
                        //   const allPathways = await Promise.all(
                        //     projectPathways.map(async (pathway: PathwayItem) => {
                        //       const fullPathway = await ceramicClient.ceramic.loadStream(pathway.id);
                        //       const fullPathwayQuests = fullPathway.state.next?.content.quests;
                        //       if (!fullPathwayQuests) {
                        //         return {
                        //           id: pathway.id,
                        //           ...fullPathway.state.content,
                        //         };
                        //       }
                        //       const fullQuests = await Promise.all(
                        //         fullPathwayQuests.map(async (quest: QuestItem) => {
                        //           const fullQuest = await ceramicClient.ceramic.loadStream(
                        //             quest.id,
                        //           );
                        //           return {
                        //             id: quest.id,
                        //             ...fullQuest.state.content,
                        //           };
                        //         }),
                        //       );
                        //       return {
                        //         id: pathway.id,
                        //         ...fullPathway.state.content,
                        //         quests: fullQuests,
                        //       };
                        //     }),
                        //   );
                        //   return {
                        //     id: projectId,
                        //     ...record.state.content,
                        //     pathways: allPathways,
                        //   };
                        // }
                        return [2 /*return*/, __assign(__assign(__assign({ id: projectId }, ogProject.state.content), additionalFields), { tags: Object.entries(projectTags).map(function (_a) {
                                    var streamId = _a[0], document = _a[1];
                                    return (__assign({ id: streamId }, document.content));
                                }) })];
                }
            });
        });
    };
    CeramicProjectService = __decorate([
        (0, common_1.Injectable)()
    ], CeramicProjectService);
    return CeramicProjectService;
}());
exports.CeramicProjectService = CeramicProjectService;
