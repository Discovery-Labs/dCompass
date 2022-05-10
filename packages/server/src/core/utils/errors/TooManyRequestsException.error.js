"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.TooManyRequestsException = void 0;
var common_1 = require("@nestjs/common");
var TooManyRequestsException = /** @class */ (function (_super) {
    __extends(TooManyRequestsException, _super);
    function TooManyRequestsException(message) {
        return _super.call(this, {
            error: message,
            code: 'TOO_MANY_REQUESTS',
            statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS
        }, common_1.HttpStatus.TOO_MANY_REQUESTS) || this;
    }
    return TooManyRequestsException;
}(common_1.HttpException));
exports.TooManyRequestsException = TooManyRequestsException;
