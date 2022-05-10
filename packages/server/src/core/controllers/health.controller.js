"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HealthController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var terminus_1 = require("@nestjs/terminus");
var HealthController = /** @class */ (function () {
    function HealthController(health, http) {
        this.health = health;
        this.http = http;
    }
    HealthController.prototype.check = function () {
        var _this = this;
        return this.health.check([
            function () { return _this.http.pingCheck('google', 'https://google.com'); },
            // () =>
            //   this.http.pingCheck(
            //     'ceramic-gateway',
            //     'https://gateway.ceramic.network',
            //   ),
        ]);
    };
    __decorate([
        (0, common_1.Get)(),
        (0, terminus_1.HealthCheck)(),
        openapi.ApiResponse({ status: 200, type: Object })
    ], HealthController.prototype, "check");
    HealthController = __decorate([
        (0, common_1.Controller)('health')
    ], HealthController);
    return HealthController;
}());
exports.HealthController = HealthController;
