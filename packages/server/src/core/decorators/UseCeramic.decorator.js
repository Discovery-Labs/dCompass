"use strict";
exports.__esModule = true;
exports.UseCeramic = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
exports.UseCeramic = (0, common_1.createParamDecorator)(function (data, ctx) {
    var gqlCtx = graphql_1.GqlExecutionContext.create(ctx).getContext();
    return {
        ceramicClient: gqlCtx.req.ceramicClient,
        ceramicCore: gqlCtx.req.ceramicCore
    };
});
