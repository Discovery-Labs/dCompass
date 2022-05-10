"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SolutionSubmission = void 0;
var graphql_1 = require("@nestjs/graphql");
var SolutionSubmission = /** @class */ (function () {
    function SolutionSubmission() {
    }
    __decorate([
        (0, graphql_1.Field)()
    ], SolutionSubmission.prototype, "id");
    __decorate([
        (0, graphql_1.Field)()
    ], SolutionSubmission.prototype, "solution");
    __decorate([
        (0, graphql_1.Field)()
    ], SolutionSubmission.prototype, "did");
    __decorate([
        (0, graphql_1.Field)({ nullable: true })
    ], SolutionSubmission.prototype, "reviewComment");
    __decorate([
        (0, graphql_1.Field)({ defaultValue: "under-review" })
    ], SolutionSubmission.prototype, "status");
    SolutionSubmission = __decorate([
        (0, graphql_1.ObjectType)()
    ], SolutionSubmission);
    return SolutionSubmission;
}());
exports.SolutionSubmission = SolutionSubmission;
