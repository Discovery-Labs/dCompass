"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SiweRegisterInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var SiweMessageInput_1 = require("./SiweMessageInput");
var SiweRegisterInput = /** @class */ (function () {
    function SiweRegisterInput() {
    }
    __decorate([
        (0, graphql_1.Field)(function () { return SiweMessageInput_1.SiweMessageInput; })
    ], SiweRegisterInput.prototype, "message");
    __decorate([
        (0, graphql_1.Field)({ nullable: true })
    ], SiweRegisterInput.prototype, "ens");
    SiweRegisterInput = __decorate([
        (0, graphql_1.InputType)()
    ], SiweRegisterInput);
    return SiweRegisterInput;
}());
exports.SiweRegisterInput = SiweRegisterInput;
