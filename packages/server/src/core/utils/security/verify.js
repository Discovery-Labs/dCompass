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
exports.verifyAdventurerClaimInfo = exports.verifyNFTInfo = void 0;
var ethers_1 = require("ethers");
var verifyNFTInfo = function (_a) {
    var nonceId = _a.nonceId, senderAddress = _a.senderAddress, contractAddress = _a.contractAddress, verifyContract = _a.verifyContract, objectId = _a.objectId, votesNeeded = _a.votesNeeded;
    return __awaiter(this, void 0, void 0, function () {
        var signingKey, wallet, hashMsg, messageHashBytes, flatSig, expandedSignature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    signingKey = process.env.PRIVATE_KEY;
                    if (!signingKey) {
                        throw Error('Signing key missing');
                    }
                    wallet = new ethers_1.ethers.Wallet(signingKey);
                    console.log(wallet, [
                        nonceId,
                        senderAddress,
                        contractAddress,
                        verifyContract,
                        objectId,
                    ]);
                    hashMsg = ethers_1.ethers.utils.solidityKeccak256(['uint256', 'address', 'address', 'address', 'string'], [nonceId, senderAddress, contractAddress, verifyContract, objectId]);
                    if (votesNeeded) {
                        hashMsg = ethers_1.ethers.utils.solidityKeccak256(['uint256', 'uint256', 'address', 'address', 'address', 'string'], [
                            nonceId,
                            votesNeeded,
                            senderAddress,
                            contractAddress,
                            verifyContract,
                            objectId,
                        ]);
                    }
                    messageHashBytes = ethers_1.ethers.utils.arrayify(hashMsg);
                    return [4 /*yield*/, wallet.signMessage(messageHashBytes)];
                case 1:
                    flatSig = _b.sent();
                    expandedSignature = ethers_1.ethers.utils.splitSignature(flatSig);
                    return [2 /*return*/, expandedSignature];
            }
        });
    });
};
exports.verifyNFTInfo = verifyNFTInfo;
var verifyAdventurerClaimInfo = function (_a) {
    var nonceId = _a.nonceId, senderAddress = _a.senderAddress, contractAddress = _a.contractAddress, objectId = _a.objectId, chainId = _a.chainId, _b = _a.version, version = _b === void 0 ? 0 : _b;
    return __awaiter(this, void 0, void 0, function () {
        var signingKey, wallet, hashMsg, messageHashBytes, flatSig, expandedSignature;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    signingKey = process.env.PRIVATE_KEY;
                    if (!signingKey) {
                        throw Error('Signing key missing');
                    }
                    wallet = new ethers_1.ethers.Wallet(signingKey);
                    hashMsg = ethers_1.ethers.utils.solidityKeccak256(['address', 'address', 'uint256', 'uint', 'uint256', 'string'], [senderAddress, contractAddress, chainId, nonceId, version, objectId]);
                    messageHashBytes = ethers_1.ethers.utils.arrayify(hashMsg);
                    return [4 /*yield*/, wallet.signMessage(messageHashBytes)];
                case 1:
                    flatSig = _c.sent();
                    expandedSignature = ethers_1.ethers.utils.splitSignature(flatSig);
                    return [2 /*return*/, expandedSignature];
            }
        });
    });
};
exports.verifyAdventurerClaimInfo = verifyAdventurerClaimInfo;
