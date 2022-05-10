"use strict";
exports.__esModule = true;
exports.generateHmac = void 0;
var crypto_1 = require("crypto");
var generateHmac = function (secret, rawBody) {
    return crypto_1["default"]
        .createHmac('sha256', secret)
        .update(Buffer.from(rawBody))
        .digest('base64');
};
exports.generateHmac = generateHmac;
