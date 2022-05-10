"use strict";
exports.__esModule = true;
exports.redisProviders = void 0;
var redis_1 = require("../../constants/redis");
var redis_2 = require("./redis");
exports.redisProviders = [
    {
        provide: redis_1.PUB_SUB,
        useValue: redis_2.pubSub
    },
];
