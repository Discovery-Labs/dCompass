"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EditProjectInput = void 0;
var eager_import_0 = require("./ProjectSquads.input");
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var ProjectSquads_input_1 = require("./ProjectSquads.input");
var EditProjectInput = /** @class */ (function () {
    function EditProjectInput() {
    }
    EditProjectInput._GRAPHQL_METADATA_FACTORY = function () {
        return { id: { type: function () { return String; } }, tokenUris: { nullable: true, type: function () { return [String]; } }, logo: { nullable: true, type: function () { return String; } }, name: { nullable: true, type: function () { return String; } }, description: { nullable: true, type: function () { return String; } }, squads: { nullable: true, type: function () { return [require("./ProjectSquads.input").ProjectSquadsInput]; } }, color: { nullable: true, type: function () { return String; } }, whitepaper: { nullable: true, type: function () { return String; } }, website: { nullable: true, type: function () { return String; } }, twitter: { nullable: true, type: function () { return String; } }, discord: { nullable: true, type: function () { return String; } }, github: { nullable: true, type: function () { return String; } } };
    };
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], EditProjectInput.prototype, "id");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; }, { nullable: true })
    ], EditProjectInput.prototype, "tokenUris");
    __decorate([
        (0, graphql_1.Field)()
    ], EditProjectInput.prototype, "logo");
    __decorate([
        (0, graphql_1.Field)()
    ], EditProjectInput.prototype, "name");
    __decorate([
        (0, graphql_1.Field)()
    ], EditProjectInput.prototype, "description");
    __decorate([
        (0, graphql_1.Field)(function () { return [ProjectSquads_input_1.ProjectSquadsInput]; })
    ], EditProjectInput.prototype, "squads");
    __decorate([
        (0, graphql_1.Field)()
    ], EditProjectInput.prototype, "color");
    __decorate([
        (0, graphql_1.Field)()
    ], EditProjectInput.prototype, "whitepaper");
    __decorate([
        (0, graphql_1.Field)()
    ], EditProjectInput.prototype, "website");
    __decorate([
        (0, graphql_1.Field)()
    ], EditProjectInput.prototype, "twitter");
    __decorate([
        (0, graphql_1.Field)()
    ], EditProjectInput.prototype, "discord");
    __decorate([
        (0, graphql_1.Field)()
    ], EditProjectInput.prototype, "github");
    EditProjectInput = __decorate([
        (0, graphql_1.InputType)()
    ], EditProjectInput);
    return EditProjectInput;
}());
exports.EditProjectInput = EditProjectInput;
