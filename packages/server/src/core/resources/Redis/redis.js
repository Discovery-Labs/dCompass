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
exports.__esModule = true;
exports.sessionMiddleware = exports.pubSub = exports.redis = exports.authRedis = void 0;
var ioredis_1 = require("ioredis");
var express_session_1 = require("express-session");
var connect_redis_1 = require("connect-redis");
var graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
var config_1 = require("../../configs/config");
var _a = (0, config_1["default"])(), redisConfig = _a.redisConfig, sessionOptions = _a.sessionOptions, redisAuthConfig = _a.redisAuthConfig;
exports.authRedis = new ioredis_1["default"](__assign({}, redisAuthConfig));
exports.redis = new ioredis_1["default"](__assign({}, redisConfig));
// create Redis-based pub-sub
exports.pubSub = new graphql_redis_subscriptions_1.RedisPubSub({
    publisher: new ioredis_1["default"](__assign({}, redisConfig)),
    subscriber: new ioredis_1["default"](__assign({}, redisConfig))
});
var RedisStore = (0, connect_redis_1["default"])(express_session_1["default"]);
exports.sessionMiddleware = (0, express_session_1["default"])(__assign({ store: new RedisStore({
        client: exports.authRedis
    }) }, sessionOptions));
