import { Logger } from '@nestjs/common';
import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseCeramicClient } from '../../../core/decorators/UseCeramicClient.decorator';
import { Ceramic, Context as ContextType } from '../../../core/utils/types';
import { User } from '../User.entity';
import { UserService } from '../User.service';

@Resolver(() => User)
export class MeResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => User, {
    nullable: true,
    description: 'Gets the currently logged in user',
    name: 'me',
  })
  async me(
    @Context() ctx: ContextType,
    @UseCeramicClient() ceramicClient: Ceramic,
  ): Promise<User | undefined> {
    Logger.log('ceramicClient', ceramicClient);
    if (!ctx.req.session.userId || !ceramicClient) {
      return undefined;
    }
    const user = await this.userService.findByDID(ctx.req.session.userId);
    return user;
  }
}
