"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.QuestNFT = exports.RarityEnum = void 0;
var graphql_1 = require("@nestjs/graphql");
var RarityEnum;
(function (RarityEnum) {
    RarityEnum["COMMON"] = "common";
    RarityEnum["UNCOMMON"] = "uncommon";
    RarityEnum["EPIC"] = "epic";
    RarityEnum["LEGENDARY"] = "legendary";
})(RarityEnum = exports.RarityEnum || (exports.RarityEnum = {}));
(0, graphql_1.registerEnumType)(RarityEnum, {
    name: 'RarityEnum',
    description: 'Rarity of the NFT, from lowest to highest rarity: common, uncommon, epic, legendary'
});
var QuestNFT = /** @class */ (function () {
    function QuestNFT() {
    }
    __decorate([
        (0, graphql_1.Field)()
    ], QuestNFT.prototype, "name");
    __decorate([
        (0, graphql_1.Field)()
    ], QuestNFT.prototype, "url");
    __decorate([
        (0, graphql_1.Field)(function () { return RarityEnum; })
    ], QuestNFT.prototype, "rarity");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; })
    ], QuestNFT.prototype, "claimedBy");
    QuestNFT = __decorate([
        (0, graphql_1.ObjectType)()
    ], QuestNFT);
    return QuestNFT;
}());
exports.QuestNFT = QuestNFT;
