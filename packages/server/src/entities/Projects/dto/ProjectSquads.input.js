"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProjectSquadsInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var ProjectSquadsInput = /** @class */ (function () {
    function ProjectSquadsInput() {
    }
    ProjectSquadsInput._GRAPHQL_METADATA_FACTORY = function () {
        return { name: { type: function () { return String; } }, image: { type: function () { return String; } }, members: { type: function () { return [String]; } } };
    };
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], ProjectSquadsInput.prototype, "name");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], ProjectSquadsInput.prototype, "image");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], ProjectSquadsInput.prototype, "members");
    ProjectSquadsInput = __decorate([
        (0, graphql_1.InputType)()
    ], ProjectSquadsInput);
    return ProjectSquadsInput;
}());
exports.ProjectSquadsInput = ProjectSquadsInput;
