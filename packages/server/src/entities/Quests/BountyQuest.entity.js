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
exports.BountyQuest = void 0;
var eager_import_0 = require("./dto/SolutionSubmission");
var openapi = require("@nestjs/swagger");
var graphql_1 = require("@nestjs/graphql");
var SolutionSubmission_1 = require("./dto/SolutionSubmission");
var Quest_entity_1 = require("./Quest.entity");
var BountyQuest = /** @class */ (function (_super) {
    __extends(BountyQuest, _super);
    function BountyQuest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BountyQuest._OPENAPI_METADATA_FACTORY = function () {
        return { submissions: { required: true, type: function () { return [require("./dto/SolutionSubmission").SolutionSubmission]; } }, isProjectContributor: { required: false, type: function () { return Boolean; } } };
    };
    BountyQuest._GRAPHQL_METADATA_FACTORY = function () {
        return { submissions: { type: function () { return [require("./dto/SolutionSubmission").SolutionSubmission]; } }, isProjectContributor: { nullable: true, type: function () { return Boolean; } } };
    };
    __decorate([
        (0, graphql_1.Field)(function () { return [SolutionSubmission_1.SolutionSubmission]; }, { defaultValue: [] })
    ], BountyQuest.prototype, "submissions");
    __decorate([
        (0, graphql_1.Field)(function () { return Boolean; }, { defaultValue: false })
    ], BountyQuest.prototype, "isProjectContributor");
    BountyQuest = __decorate([
        (0, graphql_1.ObjectType)()
    ], BountyQuest);
    return BountyQuest;
}(Quest_entity_1.Quest));
exports.BountyQuest = BountyQuest;
