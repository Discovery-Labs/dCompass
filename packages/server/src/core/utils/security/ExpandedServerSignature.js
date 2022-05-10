"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ExpandedServerSignature = void 0;
var graphql_1 = require("@nestjs/graphql");
var ExpandedServerSignature = /** @class */ (function () {
    // TODO: extend from chainId & namespace
    function ExpandedServerSignature() {
    }
    __decorate([
        (0, graphql_1.Field)()
    ], ExpandedServerSignature.prototype, "r");
    __decorate([
        (0, graphql_1.Field)()
    ], ExpandedServerSignature.prototype, "s");
    __decorate([
        (0, graphql_1.Field)(function () { return graphql_1.Int; })
    ], ExpandedServerSignature.prototype, "v");
    ExpandedServerSignature = __decorate([
        (0, graphql_1.ObjectType)()
        // TODO: extend from chainId & namespace
    ], ExpandedServerSignature);
    return ExpandedServerSignature;
}());
exports.ExpandedServerSignature = ExpandedServerSignature;
