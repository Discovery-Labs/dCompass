"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.QuestAnswersSubmitionInput = void 0;
var eager_import_0 = require("./QuestQuestionAnswer.input");
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var QuestQuestionAnswer_input_1 = require("./QuestQuestionAnswer.input");
var QuestAnswersSubmitionInput = /** @class */ (function () {
    function QuestAnswersSubmitionInput() {
    }
    QuestAnswersSubmitionInput._GRAPHQL_METADATA_FACTORY = function () {
        return { questId: { type: function () { return String; } }, did: { type: function () { return String; } }, questionAnswers: { type: function () { return [require("./QuestQuestionAnswer.input").QuestQuestionAnswerInput]; } } };
    };
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], QuestAnswersSubmitionInput.prototype, "questId");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], QuestAnswersSubmitionInput.prototype, "did");
    __decorate([
        (0, graphql_1.Field)(function () { return [QuestQuestionAnswer_input_1.QuestQuestionAnswerInput]; }),
        (0, class_validator_1.IsArray)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], QuestAnswersSubmitionInput.prototype, "questionAnswers");
    QuestAnswersSubmitionInput = __decorate([
        (0, graphql_1.InputType)()
    ], QuestAnswersSubmitionInput);
    return QuestAnswersSubmitionInput;
}());
exports.QuestAnswersSubmitionInput = QuestAnswersSubmitionInput;
