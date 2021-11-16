import validate from 'uuid-validate';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { redis } from '../../../core/resources/Redis/redis';
import { confirmUserPrefix } from '../../../core/constants/redis';
import { RateLimitOptions } from '../../../core/decorators/RateLimitOptions.decorator';
import { RateLimiterGuard } from '../../../core/middlewares/guards/RateLimiterGuard.guard';
import { UserService } from '../User.service';
import { TokenInput } from '../dto/TokenInput';

@Resolver()
export class ConfirmationTokenStatusResolver {
  constructor(private readonly userService: UserService) {}
  @RateLimitOptions({
    // 1 day expiration & window
    windowMs: 60 * 60 * 1000 * 1,
    max: 10,
    limitByVariables: false,
    errorMessage: 'security.rateLimitExceeded.confirmationTokenStatus',
  })
  @UseGuards(RateLimiterGuard)
  @Query(() => Int, {
    nullable: true,
    description: 'Checks if a user confirmation token is valid',
  })
  async confirmationTokenStatus(
    @Args('input') { token }: TokenInput,
  ): Promise<number> {
    const isValidUuid = validate(token, 4);
    if (!isValidUuid) {
      return 400;
    }
    const userId = await redis.get(confirmUserPrefix + token);
    if (!userId) {
      return 404;
    }
    const user = await this.userService.findByDID(userId);
    if (!user) {
      return 404;
    }

    if (!user.confirmed) {
      return 422;
    }

    return 200;
  }
}
