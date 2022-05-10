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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.CreateProjectResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var apollo_server_errors_1 = require("apollo-server-errors");
var UseCeramic_decorator_1 = require("../../../core/decorators/UseCeramic.decorator");
var UseSiwe_decorator_1 = require("../../../core/decorators/UseSiwe.decorator");
var helpers_1 = require("../../../core/utils/helpers");
var Project_entity_1 = require("../Project.entity");
var CreateProjectResolver = /** @class */ (function () {
    function CreateProjectResolver(projectService) {
        this.projectService = projectService;
    }
    CreateProjectResolver.prototype.createProject = function (siwe, _a, _b) {
        var ceramicClient = _a.ceramicClient;
        var id = _b.id, tokenUris = _b.tokenUris;
        return __awaiter(this, void 0, void 0, function () {
            var address, ogProject, ownerAccounts, formattedAccounts, _c, squads, tags, ogProjectInfos, prismaProject, projectWithSquadsAndTags, serializedProject;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        address = siwe.address;
                        return [4 /*yield*/, ceramicClient.ceramic.loadStream(id)];
                    case 1:
                        ogProject = _d.sent();
                        return [4 /*yield*/, ceramicClient.dataStore.get("cryptoAccounts", ogProject.controllers[0])];
                    case 2:
                        ownerAccounts = _d.sent();
                        if (!ownerAccounts)
                            throw new apollo_server_errors_1.ForbiddenError("Unauthorized");
                        formattedAccounts = Object.keys(ownerAccounts).map(function (account) { return account.split("@")[0]; });
                        if (!formattedAccounts.includes(address)) {
                            throw new apollo_server_errors_1.ForbiddenError("Unauthorized");
                        }
                        _c = ogProject.content, squads = _c.squads, tags = _c.tags, ogProjectInfos = __rest(_c, ["squads", "tags"]);
                        return [4 /*yield*/, this.projectService.createProject(__assign(__assign({ streamId: id }, ogProjectInfos), { tags: {
                                    connect: tags
                                }, tokenUris: tokenUris, isFeatured: false, createdBy: address }))];
                    case 3:
                        prismaProject = _d.sent();
                        return [4 /*yield*/, this.projectService.createSquads(squads.map(function (squad) { return (__assign(__assign({}, squad), { projectId: prismaProject.id })); }))];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, this.projectService.projectWithSquadsAndTags({
                                id: prismaProject.id
                            })];
                    case 5:
                        projectWithSquadsAndTags = _d.sent();
                        serializedProject = (0, helpers_1["default"])(projectWithSquadsAndTags);
                        return [2 /*return*/, serializedProject];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Mutation)(function () { return Project_entity_1.Project; }, {
            nullable: true,
            description: "Create a new Project in dCompass",
            name: "createProject"
        }),
        __param(0, (0, UseSiwe_decorator_1.UseSiwe)()),
        __param(1, (0, UseCeramic_decorator_1.UseCeramic)()),
        __param(2, (0, graphql_1.Args)("input"))
    ], CreateProjectResolver.prototype, "createProject");
    CreateProjectResolver = __decorate([
        (0, graphql_1.Resolver)(function () { return [String]; })
    ], CreateProjectResolver);
    return CreateProjectResolver;
}());
exports.CreateProjectResolver = CreateProjectResolver;
