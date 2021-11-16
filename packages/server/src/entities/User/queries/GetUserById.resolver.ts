import { Resolver, Query, Args } from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';

import { User } from '../User.entity';
import { UserDIDInput } from '../dto/UserDIDInput';
import { UserService } from '../User.service';
// import { GET_USER_BY_ID_QUERY } from '../../../core/constants/graphqlResolvers';
// import { Permission } from '../../Permission/decorators/Permission.decorator';
// import { GqlAutorisationGuard } from '../../../core/middlewares/guards/GqlAutorisationGuard.guard';

@Resolver()
export class GetUserByIdResolver {
  constructor(private readonly userService: UserService) {}
  // @Permission({
  //   action: 'read',
  //   name: GET_USER_BY_ID_QUERY,
  //   possession: 'any',
  //   resource: 'user',
  //   attributes: ['*'],
  // })
  // @UseGuards(GqlAutorisationGuard)
  @Query(() => User, {
    nullable: true,
    description: 'Gets a user by ID and returns its informations',
  })
  async getUserById(
    @Args('input') { userDID }: UserDIDInput,
  ): Promise<User | undefined> {
    return this.userService.findByDID(userDID);
  }
}
