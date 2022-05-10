"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SiweMessageInput = exports.SignatureType = void 0;
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var SignatureType;
(function (SignatureType) {
    /**EIP-191 signature scheme */
    SignatureType["PERSONAL_SIGNATURE"] = "Personal signature";
})(SignatureType = exports.SignatureType || (exports.SignatureType = {}));
(0, graphql_1.registerEnumType)(SignatureType, {
    name: "SignatureType",
    description: "EIP-191 signature scheme"
});
var SiweMessageInput = /** @class */ (function () {
    function SiweMessageInput() {
    }
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], SiweMessageInput.prototype, "domain");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], SiweMessageInput.prototype, "address");
    __decorate([
        (0, graphql_1.Field)()
    ], SiweMessageInput.prototype, "statement");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], SiweMessageInput.prototype, "uri");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], SiweMessageInput.prototype, "version");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], SiweMessageInput.prototype, "chainId");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], SiweMessageInput.prototype, "nonce");
    __decorate([
        (0, graphql_1.Field)(),
        (0, class_validator_1.IsString)({ message: "wrong.type" }),
        (0, class_validator_1.IsDefined)({ message: "not.defined" }),
        (0, class_validator_1.IsNotEmpty)({ message: "not.empty" })
    ], SiweMessageInput.prototype, "issuedAt");
    __decorate([
        (0, graphql_1.Field)({ nullable: true })
    ], SiweMessageInput.prototype, "expirationTime");
    __decorate([
        (0, graphql_1.Field)({ nullable: true })
    ], SiweMessageInput.prototype, "notBefore");
    __decorate([
        (0, graphql_1.Field)({ nullable: true })
    ], SiweMessageInput.prototype, "requestId");
    __decorate([
        (0, graphql_1.Field)(function () { return [String]; }, { nullable: true })
    ], SiweMessageInput.prototype, "resources");
    __decorate([
        (0, graphql_1.Field)()
    ], SiweMessageInput.prototype, "signature");
    __decorate([
        (0, graphql_1.Field)(function () { return SignatureType; })
    ], SiweMessageInput.prototype, "type");
    SiweMessageInput = __decorate([
        (0, graphql_1.InputType)()
    ], SiweMessageInput);
    return SiweMessageInput;
}());
exports.SiweMessageInput = SiweMessageInput;
