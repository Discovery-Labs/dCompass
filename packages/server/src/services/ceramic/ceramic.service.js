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
exports.getCeramicAlias = exports.readCeramicRecord = exports.createCeramicDocument = exports.makeCeramicClient = void 0;
var http_client_1 = require("@ceramicnetwork/http-client");
var key_did_resolver_1 = require("key-did-resolver");
var _3id_did_resolver_1 = require("@ceramicnetwork/3id-did-resolver");
var fs_1 = require("fs");
var stream_tile_1 = require("@ceramicnetwork/stream-tile");
var key_did_provider_ed25519_1 = require("key-did-provider-ed25519");
var dids_1 = require("dids");
var idx_1 = require("@ceramicstudio/idx");
var idx_tools_1 = require("@ceramicstudio/idx-tools");
var uint8arrays_1 = require("uint8arrays");
var random_1 = require("@stablelib/random");
var schemas_1 = require("@discovery-dao/schemas");
var common_1 = require("@nestjs/common");
var config_1 = require("../../core/configs/config");
function makeCeramicClient() {
    return __awaiter(this, void 0, void 0, function () {
        var ceramicConfigJson, ceramicConfig, ceramic, keyDidResolver, threeIdResolver, resolverRegistry, did, aliases, schemasCommitId, _i, _a, _b, schemaName, schema, publishedSchema, publishedSchemaCommitId, createdDefinition, config_2, idx_2, idx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile('./src/config.json')];
                case 1:
                    ceramicConfigJson = _c.sent();
                    ceramicConfig = JSON.parse(ceramicConfigJson.toString());
                    // The seed must be provided as an environment variable
                    if (!process.env.CERAMIC_SEED) {
                        common_1.Logger.warn('NO CERAMIC SEED, A NEW ONE WILL BE GENERATED');
                        process.env.CERAMIC_SEED = (0, uint8arrays_1.toString)((0, random_1.randomBytes)(32), 'base16');
                    }
                    ceramic = new http_client_1["default"]((0, config_1["default"])().ceramic.apiUrl);
                    keyDidResolver = key_did_resolver_1["default"].getResolver();
                    threeIdResolver = _3id_did_resolver_1["default"].getResolver(ceramic);
                    resolverRegistry = __assign(__assign({}, threeIdResolver), keyDidResolver);
                    did = new dids_1.DID({
                        provider: new key_did_provider_ed25519_1.Ed25519Provider((0, uint8arrays_1.fromString)((0, config_1["default"])().ceramic.seed, 'base16')),
                        resolver: resolverRegistry
                    });
                    return [4 /*yield*/, did.authenticate()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, ceramic.setDID(did)];
                case 3:
                    _c.sent();
                    if (!((0, config_1["default"])().ceramic.forceSync ||
                        Object.keys(ceramicConfig.schemas).length === 0 ||
                        Object.keys(ceramicConfig.definitions).length === 0)) return [3 /*break*/, 10];
                    process.env.CERAMIC_FORCE_SYNC = 'false';
                    aliases = {};
                    schemasCommitId = {};
                    _i = 0, _a = Object.entries(schemas_1.schemas.dCompass);
                    _c.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    _b = _a[_i], schemaName = _b[0], schema = _b[1];
                    return [4 /*yield*/, (0, idx_tools_1.publishSchema)(ceramic, {
                            content: schema,
                            name: schemaName
                        })];
                case 5:
                    publishedSchema = _c.sent();
                    publishedSchemaCommitId = publishedSchema.commitId.toUrl();
                    schemasCommitId[schemaName] = publishedSchemaCommitId;
                    return [4 /*yield*/, (0, idx_tools_1.createDefinition)(ceramic, {
                            name: schemaName,
                            description: "Discovery schema for ".concat(schemaName),
                            schema: publishedSchemaCommitId
                        })];
                case 6:
                    createdDefinition = _c.sent();
                    aliases[schemaName] = createdDefinition.id.toString();
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 4];
                case 8:
                    config_2 = {
                        definitions: aliases,
                        schemas: schemasCommitId
                    };
                    return [4 /*yield*/, fs_1.promises.writeFile('./src/config.json', JSON.stringify(config_2))];
                case 9:
                    _c.sent();
                    idx_2 = new idx_1.IDX({ ceramic: ceramic, aliases: aliases });
                    return [2 /*return*/, { ceramic: ceramic, idx: idx_2, schemasCommitId: schemasCommitId }];
                case 10:
                    idx = new idx_1.IDX({ ceramic: ceramic, aliases: ceramicConfig.definitions });
                    return [2 /*return*/, { ceramic: ceramic, idx: idx, schemasCommitId: ceramicConfig.schemas }];
            }
        });
    });
}
exports.makeCeramicClient = makeCeramicClient;
function createCeramicDocument(_a, _b) {
    var _c, _d;
    var ceramic = _a.ceramic, idx = _a.idx;
    var data = _b.data, family = _b.family, schema = _b.schema;
    return __awaiter(this, void 0, void 0, function () {
        var doc, streamId, error_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    if (!ceramic) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, stream_tile_1.TileDocument.create(ceramic, data, {
                            controllers: ((_c = ceramic === null || ceramic === void 0 ? void 0 : ceramic.did) === null || _c === void 0 ? void 0 : _c.id) ? [(_d = ceramic === null || ceramic === void 0 ? void 0 : ceramic.did) === null || _d === void 0 ? void 0 : _d.id] : [],
                            family: family,
                            schema: schema
                        })];
                case 1:
                    doc = _e.sent();
                    streamId = doc.id.toString();
                    return [2 /*return*/, { streamId: streamId, doc: doc }];
                case 2:
                    error_1 = _e.sent();
                    console.log({ createCeramicDocumentError: error_1 });
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createCeramicDocument = createCeramicDocument;
function readCeramicRecord(_a, alias, DID_OR_CAIP10_ID) {
    var idx = _a.idx;
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, idx.get(alias, DID_OR_CAIP10_ID)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    error_2 = _b.sent();
                    console.log({ readCeramicRecordError: error_2 });
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.readCeramicRecord = readCeramicRecord;
function getCeramicAlias(_a, alias) {
    var idx = _a.idx;
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, idx.get(alias)];
                case 1: return [2 /*return*/, _b.sent()]; // uses authenticated DID
                case 2:
                    error_3 = _b.sent();
                    console.log({ getCeramicAliasError: error_3 });
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getCeramicAlias = getCeramicAlias;
