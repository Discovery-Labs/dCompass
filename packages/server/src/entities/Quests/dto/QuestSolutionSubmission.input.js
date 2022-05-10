"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.QuestSolutionSubmissionInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var QuestSolutionSubmissionInput = /** @class */ (function () {
    function QuestSolutionSubmissionInput() {
    }
    QuestSolutionSubmissionInput._GRAPHQL_METADATA_FACTORY = function () {
        return { questId: { type: function () { return String; } }, did: { type: function () { return String; } }, solution: { type: function () { return String; } } };
    };
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], QuestSolutionSubmissionInput.prototype, "questId");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], QuestSolutionSubmissionInput.prototype, "did");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], QuestSolutionSubmissionInput.prototype, "solution");
    QuestSolutionSubmissionInput = __decorate([
        (0, graphql_1.InputType)()
    ], QuestSolutionSubmissionInput);
    return QuestSolutionSubmissionInput;
}());
exports.QuestSolutionSubmissionInput = QuestSolutionSubmissionInput;
