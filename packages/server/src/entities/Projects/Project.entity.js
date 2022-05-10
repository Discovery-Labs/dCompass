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
exports.Project = void 0;
var eager_import_0 = require("../Tags/Tag.entity");
var eager_import_1 = require("../Pathways/Pathway.entity");
var eager_import_2 = require("../Squads/Squad.entity");
var openapi = require("@nestjs/swagger");
var graphql_1 = require("@nestjs/graphql");
var BaseEntity_1 = require("../../core/entities/BaseEntity");
var Pathway_entity_1 = require("../Pathways/Pathway.entity");
var Squad_entity_1 = require("../Squads/Squad.entity");
var Tag_entity_1 = require("../Tags/Tag.entity");
var Project = /** @class */ (function (_super) {
    __extends(Project, _super);
    function Project() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Project._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, streamId: { required: true, type: function () { return String; } }, name: { required: true, type: function () { return String; } }, color: { required: false, type: function () { return String; } }, whitepaper: { required: false, type: function () { return String; } }, website: { required: true, type: function () { return String; } }, twitter: { required: false, type: function () { return String; } }, discord: { required: false, type: function () { return String; } }, github: { required: false, type: function () { return String; } }, gitbook: { required: false, type: function () { return String; } }, createdBy: { required: true, type: function () { return String; } }, updatedBy: { required: false, type: function () { return String; } }, description: { required: true, type: function () { return String; } }, slogan: { required: true, type: function () { return String; } }, logo: { required: false, type: function () { return String; } }, contracts: { required: false, type: function () { return [String]; } }, members: { required: false, type: function () { return [String]; } }, pendingMembers: { required: false, type: function () { return [String]; } }, tokenUris: { required: true, type: function () { return [String]; } }, isFeatured: { required: true, type: function () { return Boolean; } }, tags: { required: false, type: function () { return [require("../Tags/Tag.entity").Tag]; } }, pathways: { required: false, type: function () { return [require("../Pathways/Pathway.entity").Pathway]; } }, pendingPathways: { required: false, type: function () { return [require("../Pathways/Pathway.entity").Pathway]; } }, squads: { required: true, type: function () { return [require("../Squads/Squad.entity").Squad]; } }, repos: { required: false, type: function () { return [String]; } }, peerProjects: { required: false, type: function () { return [String]; } } };
    };
    Project._GRAPHQL_METADATA_FACTORY = function () {
        return { id: { type: function () { return String; } }, streamId: { type: function () { return String; } }, name: { type: function () { return String; } }, color: { nullable: true, type: function () { return String; } }, whitepaper: { nullable: true, type: function () { return String; } }, website: { type: function () { return String; } }, twitter: { nullable: true, type: function () { return String; } }, discord: { nullable: true, type: function () { return String; } }, github: { nullable: true, type: function () { return String; } }, gitbook: { nullable: true, type: function () { return String; } }, createdBy: { type: function () { return String; } }, updatedBy: { nullable: true, type: function () { return String; } }, description: { type: function () { return String; } }, slogan: { type: function () { return String; } }, logo: { nullable: true, type: function () { return String; } }, contracts: { nullable: true, type: function () { return [String]; } }, members: { nullable: true, type: function () { return [String]; } }, pendingMembers: { nullable: true, type: function () { return [String]; } }, tokenUris: { type: function () { return [String]; } }, isFeatured: { type: function () { return Boolean; } }, tags: { nullable: true, type: function () { return [require("../Tags/Tag.entity").Tag]; } }, pathways: { nullable: true, type: function () { return [require("../Pathways/Pathway.entity").Pathway]; } }, pendingPathways: { nullable: true, type: function () { return [require("../Pathways/Pathway.entity").Pathway]; } }, squads: { type: function () { return [require("../Squads/Squad.entity").Squad]; } }, repos: { nullable: true, type: function () { return [String]; } }, peerProjects: { nullable: true, type: function () { return [String]; } } };
    };
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "id");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "streamId");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "name");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "color");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "whitepaper");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "website");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "twitter");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "discord");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "github");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "gitbook");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "createdBy");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "updatedBy");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "description");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "slogan");
    __decorate([
        (0, graphql_1.Field)()
    ], Project.prototype, "logo");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; }, { nullable: true })
    ], Project.prototype, "contracts");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; })
    ], Project.prototype, "members");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; })
    ], Project.prototype, "pendingMembers");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; })
    ], Project.prototype, "tokenUris");
    __decorate([
        (0, graphql_1.Field)(function () { return Boolean; }, { defaultValue: false })
    ], Project.prototype, "isFeatured");
    __decorate([
        (0, graphql_1.Field)(function () { return [Tag_entity_1.Tag]; })
    ], Project.prototype, "tags");
    __decorate([
        (0, graphql_1.Field)(function () { return [Pathway_entity_1.Pathway]; }, { defaultValue: [] })
    ], Project.prototype, "pathways");
    __decorate([
        (0, graphql_1.Field)(function () { return [Pathway_entity_1.Pathway]; }, { defaultValue: [] })
    ], Project.prototype, "pendingPathways");
    __decorate([
        (0, graphql_1.Field)(function () { return [Squad_entity_1.Squad]; })
    ], Project.prototype, "squads");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; })
    ], Project.prototype, "repos");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; })
    ], Project.prototype, "peerProjects");
    Project = __decorate([
        (0, graphql_1.ObjectType)()
    ], Project);
    return Project;
}(BaseEntity_1.BaseEntity));
exports.Project = Project;
