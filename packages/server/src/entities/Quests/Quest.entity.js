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
exports.Quest = void 0;
var eager_import_0 = require("../../core/utils/security/ExpandedServerSignature");
var openapi = require("@nestjs/swagger");
var graphql_1 = require("@nestjs/graphql");
var BaseEntity_1 = require("../../core/entities/BaseEntity");
var ExpandedServerSignature_1 = require("../../core/utils/security/ExpandedServerSignature");
var Quest = /** @class */ (function (_super) {
    __extends(Quest, _super);
    function Quest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Quest._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, streamId: { required: true, type: function () { return String; } }, name: { required: true, type: function () { return String; } }, description: { required: true, type: function () { return String; } }, slogan: { required: true, type: function () { return String; } }, questType: { required: true, type: function () { return String; } }, createdBy: { required: true, type: function () { return String; } }, rewardCurrency: { required: true, type: function () { return String; } }, rewardAmount: { required: true, type: function () { return Number; } }, rewardUserCap: { required: true, type: function () { return Number; } }, pathwayId: { required: true, type: function () { return String; } }, completedBy: { required: false, type: function () { return [String]; } }, isPending: { required: false, type: function () { return Boolean; } }, namespace: { required: false, type: function () { return String; } }, chainId: { required: true, type: function () { return Number; } }, image: { required: true, type: function () { return String; } }, expandedServerSignatures: { required: false, type: function () { return [require("../../core/utils/security/ExpandedServerSignature").ExpandedServerSignature]; } } };
    };
    Quest._GRAPHQL_METADATA_FACTORY = function () {
        return { id: { type: function () { return String; } }, streamId: { type: function () { return String; } }, name: { type: function () { return String; } }, description: { type: function () { return String; } }, slogan: { type: function () { return String; } }, questType: { type: function () { return String; } }, createdBy: { type: function () { return String; } }, rewardCurrency: { type: function () { return String; } }, rewardAmount: { type: function () { return Number; } }, rewardUserCap: { type: function () { return Number; } }, pathwayId: { type: function () { return String; } }, completedBy: { nullable: true, type: function () { return [String]; } }, isPending: { nullable: true, type: function () { return Boolean; } }, namespace: { nullable: true, type: function () { return String; } }, chainId: { type: function () { return Number; } }, image: { type: function () { return String; } }, expandedServerSignatures: { nullable: true, type: function () { return [require("../../core/utils/security/ExpandedServerSignature").ExpandedServerSignature]; } } };
    };
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "id");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "streamId");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "name");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "description");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "slogan");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "questType");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "createdBy");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "rewardCurrency");
    __decorate([
        (0, graphql_1.Field)(function () { return graphql_1.Float; })
    ], Quest.prototype, "rewardAmount");
    __decorate([
        (0, graphql_1.Field)(function () { return graphql_1.Int; })
    ], Quest.prototype, "rewardUserCap");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "pathwayId");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; }, { defaultValue: [] })
    ], Quest.prototype, "completedBy");
    __decorate([
        (0, graphql_1.Field)(function () { return Boolean; })
    ], Quest.prototype, "isPending");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "namespace");
    __decorate([
        (0, graphql_1.Field)(function () { return graphql_1.Int; })
    ], Quest.prototype, "chainId");
    __decorate([
        (0, graphql_1.Field)()
    ], Quest.prototype, "image");
    __decorate([
        (0, graphql_1.Field)(function () { return [ExpandedServerSignature_1.ExpandedServerSignature]; })
    ], Quest.prototype, "expandedServerSignatures");
    Quest = __decorate([
        (0, graphql_1.ObjectType)({ isAbstract: true })
    ], Quest);
    return Quest;
}(BaseEntity_1.BaseEntity));
exports.Quest = Quest;
