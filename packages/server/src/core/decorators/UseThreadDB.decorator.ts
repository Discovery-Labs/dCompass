import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UseThreadDB = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx).getContext();
    return {
      dbClient: gqlCtx.req.dbClient,
      latestThreadId: gqlCtx.req.latestThreadId,
    };
  },
);
