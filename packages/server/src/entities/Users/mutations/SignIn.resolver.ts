import { Resolver, Mutation, Args, Context } from "@nestjs/graphql";
import { BadRequestException, ForbiddenException } from "@nestjs/common";

import {
  Context as ContextType,
  UseCeramicClient,
} from "../../../core/utils/types";
import config from "../../../core/configs/config";
import { User } from "../User.entity";
import { SiweMessage } from "siwe";
import { SiweRegisterInput } from "../dto/SignInInput";
import { providers } from "ethers";
import { getInfuraUrl } from "../../../core/utils/helpers/networks";
import { UserService } from "../User.service";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";

const {
  api: { port, hostname, protocol },
  infuraKey,
} = config();
@Resolver()
export class SignInResolver {
  constructor(private readonly userService: UserService) {}
  @Mutation(() => User || null, {
    nullable: true,
    description: "Sign in a user and notifies the connected clients",
  })
  async signIn(
    @Context() ctx: ContextType,
    @UseCeramic() { ceramicCore }: UseCeramicClient,
    @Args("input")
    { ens, message }: SiweRegisterInput
  ): Promise<User | null> {
    try {
      if (!message) {
        throw new BadRequestException({
          message: "Expected siwe message as input",
        });
      }
      const siweMsg = new SiweMessage(message);
      console.log({ siweMsg });
      const infuraProvider = new providers.JsonRpcProvider(
        {
          allowGzip: true,
          url: `${getInfuraUrl(siweMsg.chainId)}/${infuraKey}`,
          headers: {
            Accept: "*/*",
            Origin: `${protocol}://${hostname}:${port}`,
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/json",
          },
        },
        siweMsg.chainId
      );
      await infuraProvider.ready;

      if (message.signature) {
        const isValid = await siweMsg.verify({
          signature: message.signature,
          domain: message.domain,
          nonce: message.nonce,
          time: message.issuedAt,
        });
        if (!isValid.success || isValid.error) {
          throw new ForbiddenException("Invalid SIWE param");
        }
      }

      if (siweMsg.nonce !== ctx.req.session.nonce) {
        throw new ForbiddenException("Invalid SIWE param");
      }

      const chainSpecificAddress = `${siweMsg.address}@eip155:${siweMsg.chainId}`;
      let userDID = null as string | null;
      try {
        userDID = await ceramicCore.getAccountDID(chainSpecificAddress);
        console.log({ userDID });
      } catch (error) {
        console.log("User has no DID");
      }
      // Check if the user already exists
      const [foundUser] = await this.userService.users({
        where: {
          OR: [
            {
              addresses: {
                has: chainSpecificAddress,
              },
            },
            {
              did: userDID,
            },
          ],
        },
      });

      console.log({ foundUser });

      let createdUser = null;
      // If user is not registered on our app yet
      if (!foundUser) {
        createdUser = await this.userService.createUser({
          did: userDID,
          addresses: [chainSpecificAddress],
        });
      }

      ctx.req.session.siwe = siweMsg;
      ctx.req.session.ens = ens;
      ctx.req.session.nonce = null;
      if (siweMsg.expirationTime) {
        ctx.req.session.cookie.expires = new Date(siweMsg.expirationTime);
      }
      await ctx.req.session.save();

      // await this.pubSub.publish("userSignedIn", {
      //   userSignedIn: ctx.req.session.siwe.address,
      // });
      return {
        addresses: [ctx.req.session.siwe.address],
        did: ctx.req.session.ens || userDID,
        id: createdUser?.id || foundUser.id,
      };
    } catch (error) {
      ctx.req.session.siwe = null;
      ctx.req.session.nonce = null;
      ctx.req.session.ens = null;
      throw error;
    }
  }
}
