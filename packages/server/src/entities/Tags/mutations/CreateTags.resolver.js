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
exports.CreateTagsResolver = void 0;
var stream_tile_1 = require("@ceramicnetwork/stream-tile");
var graphql_1 = require("@nestjs/graphql");
var model_json_1 = require("@discovery-dao/schemas/lib/model.json");
var idx_1 = require("../../../core/constants/idx");
var UseCeramic_decorator_1 = require("../../../core/decorators/UseCeramic.decorator");
var Tag_entity_1 = require("../Tag.entity");
var CreateTagsResolver = /** @class */ (function () {
    function CreateTagsResolver() {
    }
    CreateTagsResolver.prototype.createTags = function (_a, _b) {
        var _c;
        var ceramicClient = _a.ceramicClient;
        var tags = _b.tags;
        return __awaiter(this, void 0, void 0, function () {
            var createdTags, previousTags, existingTags, allTagIds, allTagsWithContent;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, Promise.all(tags.map(function (tag) {
                            return stream_tile_1.TileDocument.create(ceramicClient.ceramic, tag, {
                                controllers: [ceramicClient.dataStore.id.toString()],
                                family: idx_1.schemaAliases.TAG_ALIAS,
                                schema: model_json_1["default"].schemas['Tag']
                            });
                        }))];
                    case 1:
                        createdTags = _d.sent();
                        console.log({ createdTags: createdTags });
                        return [4 /*yield*/, ceramicClient.dataStore.get(idx_1.schemaAliases.TAGS_ALIAS)];
                    case 2:
                        previousTags = _d.sent();
                        console.log({ previousTags: previousTags });
                        existingTags = (_c = previousTags === null || previousTags === void 0 ? void 0 : previousTags.tags) !== null && _c !== void 0 ? _c : [];
                        allTagIds = __spreadArray(__spreadArray([], existingTags, true), createdTags.map(function (tag) { return tag.id.toUrl(); }), true);
                        // Index the tags
                        return [4 /*yield*/, ceramicClient.dataStore.set(idx_1.schemaAliases.TAGS_ALIAS, {
                                tags: allTagIds
                            })];
                    case 3:
                        // Index the tags
                        _d.sent();
                        return [4 /*yield*/, ceramicClient.ceramic.multiQuery(allTagIds.map(function (tagStreamId) { return ({
                                streamId: tagStreamId
                            }); }))];
                    case 4:
                        allTagsWithContent = _d.sent();
                        return [2 /*return*/, Object.entries(allTagsWithContent).map(function (_a) {
                                var streamId = _a[0], document = _a[1];
                                return (__assign({ id: streamId }, document.content));
                            })];
                }
            });
        });
    };
    __decorate([
        (0, graphql_1.Mutation)(function () { return [Tag_entity_1.Tag]; }, {
            nullable: true,
            description: 'Creates multiple new Tags in Discovery',
            name: 'createTags'
        }),
        __param(0, (0, UseCeramic_decorator_1.UseCeramic)()),
        __param(1, (0, graphql_1.Args)('input'))
    ], CreateTagsResolver.prototype, "createTags");
    CreateTagsResolver = __decorate([
        (0, graphql_1.Resolver)(function () { return [Tag_entity_1.Tag]; })
    ], CreateTagsResolver);
    return CreateTagsResolver;
}());
exports.CreateTagsResolver = CreateTagsResolver;
