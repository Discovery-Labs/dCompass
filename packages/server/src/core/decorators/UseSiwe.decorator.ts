import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const UseSiwe = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx).getContext();
    const { siwe } = gqlCtx.req.session;
    if (!siwe) {
      throw new UnauthorizedException({ message: "You have to first sign_in" });
    }
    return siwe;
  }
);
