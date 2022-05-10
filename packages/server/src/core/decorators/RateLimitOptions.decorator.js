"use strict";
exports.__esModule = true;
exports.RateLimitOptions = void 0;
var common_1 = require("@nestjs/common");
var RateLimitOptions = function (options) {
    return (0, common_1.SetMetadata)('rateLimitOptions', options);
};
exports.RateLimitOptions = RateLimitOptions;
