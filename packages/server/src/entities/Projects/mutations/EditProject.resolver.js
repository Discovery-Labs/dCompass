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
exports.EditProjectResolver = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
var apollo_server_errors_1 = require("apollo-server-errors");
var idx_1 = require("../../../core/constants/idx");
var UseCeramic_decorator_1 = require("../../../core/decorators/UseCeramic.decorator");
var UseSiwe_decorator_1 = require("../../../core/decorators/UseSiwe.decorator");
var Project_entity_1 = require("../Project.entity");
var EditProjectResolver = /** @class */ (function () {
    function EditProjectResolver() {
    }
    EditProjectResolver.prototype.editProject = function (siwe, _a, _b) {
        var _c;
        var ceramicClient = _a.ceramicClient;
        var id = _b.id, projectValues = __rest(_b, ["id"]);
        return __awaiter(this, void 0, void 0, function () {
            var address, ogProject, allContributors, ownerAccounts, formattedOwnerAccounts, isOwner, isContributor, existingProjects, projects, currentProjectValues, updatedProject;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        address = siwe.address;
                        console.log({
                            address: address,
                            id: id,
                            projectValues: projectValues
                        });
                        return [4 /*yield*/, ceramicClient.ceramic.loadStream(id)];
                    case 1:
                        ogProject = _d.sent();
                        allContributors = ogProject.content.squads.flatMap(function (squad) { return squad.members; });
                        return [4 /*yield*/, ceramicClient.dataStore.get("cryptoAccounts", ogProject.controllers[0])];
                    case 2:
                        ownerAccounts = _d.sent();
                        if (!ownerAccounts)
                            throw new apollo_server_errors_1.ForbiddenError("Unauthorized");
                        formattedOwnerAccounts = Object.keys(ownerAccounts).map(function (account) { return account.split("@")[0]; });
                        isOwner = formattedOwnerAccounts.includes(address);
                        isContributor = allContributors.includes(address);
                        if (!isOwner || !isContributor) {
                            throw new apollo_server_errors_1.ForbiddenError("Unauthorized");
                        }
                        return [4 /*yield*/, ceramicClient.dataStore.get(idx_1.schemaAliases.APP_PROJECTS_ALIAS)];
                    case 3:
                        existingProjects = _d.sent();
                        projects = (_c = existingProjects === null || existingProjects === void 0 ? void 0 : existingProjects.projects) !== null && _c !== void 0 ? _c : [];
                        console.log({ projects: projects });
                        currentProjectValues = projects.find(function (project) { return project.id === id; });
                        if (!currentProjectValues) {
                            throw new common_1.NotFoundException("Project ".concat(id, " not found"));
                        }
                        updatedProject = __assign(__assign(__assign({ id: id }, currentProjectValues), projectValues), { updatedBy: address, updatedAt: new Date() });
                        return [4 /*yield*/, ceramicClient.dataStore.set(idx_1.schemaAliases.APP_PROJECTS_ALIAS, {
                                projects: __spreadArray([
                                    updatedProject
                                ], projects.filter(function (project) { return project.id !== id; }), true)
                            })];
                    case 4:
                        _d.sent();
                        return [2 /*return*/, updatedProject];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Mutation)(function () { return Project_entity_1.Project; }, {
            nullable: true,
            description: "Edit project in dCompass",
            name: "editProject"
        }),
        __param(0, (0, UseSiwe_decorator_1.UseSiwe)()),
        __param(1, (0, UseCeramic_decorator_1.UseCeramic)()),
        __param(2, (0, graphql_1.Args)("input"))
    ], EditProjectResolver.prototype, "editProject");
    EditProjectResolver = __decorate([
        (0, graphql_1.Resolver)(function () { return [String]; })
    ], EditProjectResolver);
    return EditProjectResolver;
}());
exports.EditProjectResolver = EditProjectResolver;
