"use strict";
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
exports.ceramicDataModelFactory = exports.ceramicCoreFactory = exports.CERAMIC_LOCAL_NODE_URL = exports.CERAMIC_MAINNET_NODE_URL = exports.CERAMIC_TESTNET_NODE_URL = exports.CERAMIC_TESTNET = void 0;
var http_client_1 = require("@ceramicnetwork/http-client");
var dids_1 = require("dids");
var key_did_provider_ed25519_1 = require("key-did-provider-ed25519");
var key_did_resolver_1 = require("key-did-resolver");
var uint8arrays_1 = require("uint8arrays");
var random_1 = require("@stablelib/random");
// The key must be provided as an environment variable
var datamodel_1 = require("@glazed/datamodel");
var did_datastore_1 = require("@glazed/did-datastore");
var core_1 = require("@self.id/core");
var model_json_1 = require("@discovery-dao/schemas/lib/model.json");
// import Box from '3box';
// import { legacy3BoxToCeramic } from './legacy3BoxToCeramic';
exports.CERAMIC_TESTNET = "testnet-clay";
exports.CERAMIC_TESTNET_NODE_URL = "https://ceramic-clay.3boxlabs.com";
exports.CERAMIC_MAINNET_NODE_URL = "https://gateway.ceramic.network";
exports.CERAMIC_LOCAL_NODE_URL = "http://localhost:7007";
// READ ONLY CLIENT
var ceramicCoreFactory = function () {
    // connect to a known URL
    // const core = new Core({ ceramic: "http://localhost:7007" });
    // or use one of the preconfigured option
    var core = new core_1.Core({
        ceramic: exports.CERAMIC_TESTNET,
        aliases: model_json_1["default"]
    });
    return core;
};
exports.ceramicCoreFactory = ceramicCoreFactory;
// DATA MODEL CLIENT
var ceramicDataModelFactory = function () { return __awaiter(void 0, void 0, void 0, function () {
    var newSeed, key, did, ceramic, model, dataStore;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!process.env.DID_KEY) {
                    console.warn("DID_KEY not found in .env, generating a new seed..");
                    newSeed = (0, uint8arrays_1.toString)((0, random_1.randomBytes)(32), "base16");
                    console.log("Seed generated. Save this in your .env as DID_KEY=".concat(newSeed));
                    process.env.DID_KEY = newSeed;
                }
                key = (0, uint8arrays_1.fromString)(process.env.DID_KEY, "base16");
                did = new dids_1.DID({
                    provider: new key_did_provider_ed25519_1.Ed25519Provider(key),
                    resolver: (0, key_did_resolver_1.getResolver)()
                });
                return [4 /*yield*/, did.authenticate()];
            case 1:
                _a.sent();
                ceramic = new http_client_1.CeramicClient(exports.CERAMIC_TESTNET_NODE_URL);
                ceramic.did = did;
                model = new datamodel_1.DataModel({ ceramic: ceramic, model: model_json_1["default"] });
                dataStore = new did_datastore_1.DIDDataStore({ ceramic: ceramic, model: model });
                return [2 /*return*/, { dataStore: dataStore, model: model, ceramic: ceramic }];
        }
    });
}); };
exports.ceramicDataModelFactory = ceramicDataModelFactory;
// export const migrateGitcoinProfile = async (address: string) => {
//   const self = await SelfID.authenticate({
//     authProvider: new EthereumAuthProvider(window.ethereum, address),
//     ceramic: 'testnet-clay',
//     connectNetwork: 'testnet-clay',
//   });
//   const { publicData, privateData, legacyProfile } = await legacy3BoxToCeramic(
//     address,
//     window.ethereum,
//   );
//   if (publicData) {
//     console.log(publicData, privateData);
//     const newProfile = await self.set('basicProfile', {
//       name: publicData.full_name,
//       description: legacyProfile.description,
//       // TODO: download image and ask if they want to use this
//       // image: publicData.avatar_url,
//     });
//   }
// };
