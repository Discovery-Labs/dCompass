"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.JoinAsContributorInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var JoinAsContributorInput = /** @class */ (function () {
    function JoinAsContributorInput() {
    }
    JoinAsContributorInput._GRAPHQL_METADATA_FACTORY = function () {
        return { did: { type: function () { return String; } }, githubUsername: { type: function () { return String; } } };
    };
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: 'wrong.type' }),
        (0, class_validator_1.IsDefined)({ message: 'not.defined' }),
        (0, class_validator_1.IsNotEmpty)({ message: 'not.empty' })
    ], JoinAsContributorInput.prototype, "did");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: 'wrong.type' }),
        (0, class_validator_1.IsDefined)({ message: 'not.defined' }),
        (0, class_validator_1.IsNotEmpty)({ message: 'not.empty' })
    ], JoinAsContributorInput.prototype, "githubUsername");
    JoinAsContributorInput = __decorate([
        (0, graphql_1.InputType)()
    ], JoinAsContributorInput);
    return JoinAsContributorInput;
}());
exports.JoinAsContributorInput = JoinAsContributorInput;
