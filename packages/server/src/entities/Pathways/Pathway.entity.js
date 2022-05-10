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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Pathway = exports.PathwayDifficultyEnum = exports.PathwayTypeEnum = void 0;
var eager_import_0 = require("./Pathway.entity");
var eager_import_1 = require("../Quests/Quest.entity");
var eager_import_2 = require("../Quests/QuizQuest.entity");
var eager_import_3 = require("../Quests/BountyQuest.entity");
var eager_import_4 = require("../../core/utils/security/ExpandedServerSignature");
var openapi = require("@nestjs/swagger");
var graphql_1 = require("@nestjs/graphql");
var BaseEntity_1 = require("../../core/entities/BaseEntity");
var ExpandedServerSignature_1 = require("../../core/utils/security/ExpandedServerSignature");
var BountyQuest_entity_1 = require("../Quests/BountyQuest.entity");
var Quest_entity_1 = require("../Quests/Quest.entity");
var QuizQuest_entity_1 = require("../Quests/QuizQuest.entity");
var PathwayTypeEnum;
(function (PathwayTypeEnum) {
    PathwayTypeEnum["BRANCHED"] = "branched";
    PathwayTypeEnum["DECRYPTED"] = "decrypted";
})(PathwayTypeEnum = exports.PathwayTypeEnum || (exports.PathwayTypeEnum = {}));
var PathwayDifficultyEnum;
(function (PathwayDifficultyEnum) {
    PathwayDifficultyEnum["BEGINNER"] = "BEGINNER";
    PathwayDifficultyEnum["INTERMEDIATE"] = "INTERMEDIATE";
    PathwayDifficultyEnum["ADVANCED"] = "ADVANCED";
    PathwayDifficultyEnum["EXPERT"] = "EXPERT";
    PathwayDifficultyEnum["WIZARD"] = "WIZARD";
})(PathwayDifficultyEnum = exports.PathwayDifficultyEnum || (exports.PathwayDifficultyEnum = {}));
(0, graphql_1.registerEnumType)(PathwayTypeEnum, {
    name: "PathwayTypeEnum",
    description: "Branched = theorical lessons and Decrypted = technical hands on lessons"
});
(0, graphql_1.registerEnumType)(PathwayDifficultyEnum, {
    name: "PathwayDifficultyEnum",
    description: "The difficulty of a pathway, from beginner to wizard where wizard is the most difficult mode"
});
var Pathway = /** @class */ (function (_super) {
    __extends(Pathway, _super);
    function Pathway() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pathway._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, streamId: { required: true, type: function () { return String; } }, title: { required: true, type: function () { return String; } }, projectId: { required: true, type: function () { return String; } }, projectStreamId: { required: true, type: function () { return String; } }, image: { required: true, type: function () { return String; } }, description: { required: true, type: function () { return String; } }, slogan: { required: true, type: function () { return String; } }, rewardCurrency: { required: true, type: function () { return String; } }, rewardAmount: { required: true, type: function () { return Number; } }, rewardUserCap: { required: true, type: function () { return Number; } }, prerequisites: { required: false, type: function () { return [String]; } }, difficulty: { required: true, "enum": require("./Pathway.entity").PathwayDifficultyEnum }, quests: { required: false, type: function () { return [require("../Quests/Quest.entity").Quest]; } }, quizQuests: { required: false, type: function () { return [require("../Quests/QuizQuest.entity").QuizQuest]; } }, bountyQuests: { required: false, type: function () { return [require("../Quests/BountyQuest.entity").BountyQuest]; } }, expandedServerSignatures: { required: false, type: function () { return [require("../../core/utils/security/ExpandedServerSignature").ExpandedServerSignature]; } }, createdBy: { required: true, type: function () { return String; } }, isPending: { required: false, type: function () { return Boolean; } } };
    };
    Pathway._GRAPHQL_METADATA_FACTORY = function () {
        return { id: { type: function () { return String; } }, streamId: { type: function () { return String; } }, title: { type: function () { return String; } }, projectId: { type: function () { return String; } }, projectStreamId: { type: function () { return String; } }, image: { type: function () { return String; } }, description: { type: function () { return String; } }, slogan: { type: function () { return String; } }, rewardCurrency: { type: function () { return String; } }, rewardAmount: { type: function () { return Number; } }, rewardUserCap: { type: function () { return Number; } }, prerequisites: { nullable: true, type: function () { return [String]; } }, difficulty: { type: function () { return require("./Pathway.entity").PathwayDifficultyEnum; } }, quests: { nullable: true, type: function () { return [require("../Quests/Quest.entity").Quest]; } }, quizQuests: { nullable: true, type: function () { return [require("../Quests/QuizQuest.entity").QuizQuest]; } }, bountyQuests: { nullable: true, type: function () { return [require("../Quests/BountyQuest.entity").BountyQuest]; } }, expandedServerSignatures: { nullable: true, type: function () { return [require("../../core/utils/security/ExpandedServerSignature").ExpandedServerSignature]; } }, createdBy: { type: function () { return String; } }, isPending: { nullable: true, type: function () { return Boolean; } } };
    };
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "id");
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "streamId");
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "title");
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "projectId");
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "projectStreamId");
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "image");
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "description");
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "slogan");
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "rewardCurrency");
    __decorate([
        (0, graphql_1.Field)(function () { return graphql_1.Float; })
    ], Pathway.prototype, "rewardAmount");
    __decorate([
        (0, graphql_1.Field)(function () { return graphql_1.Int; })
    ], Pathway.prototype, "rewardUserCap");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; })
    ], Pathway.prototype, "prerequisites");
    __decorate([
        (0, graphql_1.Field)(function () { return PathwayDifficultyEnum; })
    ], Pathway.prototype, "difficulty");
    __decorate([
        (0, graphql_1.Field)(function () { return [Quest_entity_1.Quest]; })
    ], Pathway.prototype, "quests");
    __decorate([
        (0, graphql_1.Field)(function () { return [QuizQuest_entity_1.QuizQuest]; })
    ], Pathway.prototype, "quizQuests");
    __decorate([
        (0, graphql_1.Field)(function () { return [BountyQuest_entity_1.BountyQuest]; })
    ], Pathway.prototype, "bountyQuests");
    __decorate([
        (0, graphql_1.Field)(function () { return [ExpandedServerSignature_1.ExpandedServerSignature]; })
    ], Pathway.prototype, "expandedServerSignatures");
    __decorate([
        (0, graphql_1.Field)()
    ], Pathway.prototype, "createdBy");
    __decorate([
        (0, graphql_1.Field)(function () { return Boolean; })
    ], Pathway.prototype, "isPending");
    Pathway = __decorate([
        (0, graphql_1.ObjectType)()
    ], Pathway);
    return Pathway;
}(BaseEntity_1.BaseEntity));
exports.Pathway = Pathway;
