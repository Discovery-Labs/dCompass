"use strict";
exports.__esModule = true;
exports.UseSiwe = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
exports.UseSiwe = (0, common_1.createParamDecorator)(function (data, ctx) {
    var gqlCtx = graphql_1.GqlExecutionContext.create(ctx).getContext();
    var siwe = gqlCtx.req.session.siwe;
    if (!siwe) {
        throw new common_1.UnauthorizedException({ message: "You have to first sign_in" });
    }
    return siwe;
});
