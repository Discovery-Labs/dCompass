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
exports.setRateLimit = void 0;
var common_1 = require("@nestjs/common");
var redis_1 = require("../../resources/Redis/redis");
var setRateLimit = function (_a) {
    var context = _a.context, variableValues = _a.variableValues, fieldName = _a.fieldName, max = _a.max, windowMs = _a.windowMs, limitByVariables = _a.limitByVariables, errorMessage = _a.errorMessage;
    return __awaiter(void 0, void 0, void 0, function () {
        var visitorKey, variableKey, key, oldRecord;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    visitorKey = context.req.session && context.req.session.userId
                        ? 'user:' + context.req.session.userId
                        : 'ip:' + context.req.ip;
                    variableKey = limitByVariables &&
                        JSON.stringify(variableValues)
                            .replace(/[^a-zA-Z0-9,]/g, '')
                            .trim();
                    key = ['limit', fieldName, variableKey, visitorKey].join(':');
                    return [4 /*yield*/, redis_1.redis.get(key)];
                case 1:
                    oldRecord = _b.sent();
                    if (!oldRecord) return [3 /*break*/, 5];
                    if (!(parseInt(oldRecord) > max)) return [3 /*break*/, 2];
                    throw new common_1.ForbiddenException(errorMessage);
                case 2: return [4 /*yield*/, redis_1.redis.incr(key)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, redis_1.redis.set(key, '1', 'EX', windowMs)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
};
exports.setRateLimit = setRateLimit;
