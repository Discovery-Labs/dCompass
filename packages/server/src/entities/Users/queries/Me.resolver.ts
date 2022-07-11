import { Resolver, Query } from "@nestjs/graphql";
import { SiweMessage } from "siwe";
import { UseSiwe } from "../../../core/decorators/UseSiwe.decorator";
import removeNulls from "../../../core/utils/helpers";

import { User } from "../User.entity";
import { UserService } from "../User.service";

@Resolver(() => User)
export class MeResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => User, {
    nullable: true,
    description: "Gets the currently logged in user",
    name: "me",
  })
  async me(@UseSiwe() siwe: SiweMessage): Promise<User | undefined> {
    const chainSpecificAddress = `${siwe.address}@eip155:${siwe.chainId}`;
    console.log({ chainSpecificAddress, siwe });
    const [foundUser] = await this.userService.users({
      where: {
        addresses: {
          has: chainSpecificAddress,
        },
      },
    });
    console.log({ foundUser });
    return removeNulls(foundUser);
  }
}
