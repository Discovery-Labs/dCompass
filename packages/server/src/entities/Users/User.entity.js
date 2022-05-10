"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = void 0;
var openapi = require("@nestjs/swagger");
var graphql_1 = require("@nestjs/graphql");
var User = /** @class */ (function () {
    function User() {
    }
    User._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, did: { required: true, type: function () { return String; } }, addresses: { required: true, type: function () { return [String]; } } };
    };
    User._GRAPHQL_METADATA_FACTORY = function () {
        return { id: { type: function () { return String; } }, did: { type: function () { return String; } }, addresses: { type: function () { return [String]; } } };
    };
    __decorate([
        (0, graphql_1.Field)()
    ], User.prototype, "id");
    __decorate([
        (0, graphql_1.Field)()
    ], User.prototype, "did");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; })
    ], User.prototype, "addresses");
    User = __decorate([
        (0, graphql_1.ObjectType)()
    ], User);
    return User;
}());
exports.User = User;
