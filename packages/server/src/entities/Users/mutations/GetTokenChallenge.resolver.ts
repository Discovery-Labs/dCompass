import { Resolver, Mutation, Args } from '@nestjs/graphql';
// import { newClientDB } from '../../../core/resources/ThreadDB/thread-db';

@Resolver(() => String)
export class GetTokenChallengeResolver {
  @Mutation(() => String, {
    nullable: true,
    description: 'Get token challenge in dCompass',
    name: 'getTokenChallenge',
  })
  async getTokenChallenge(
    @Args('pubKey') pubKey: string,
  ): Promise<string | undefined> {
    if (!pubKey) {
      throw new Error('Public key is missing');
    }

    /**
     * Init new Hub API Client
     *
     * see ./hub.ts
     */
    // const db = await newClientDB();
    // const token = await db.getTokenChallenge(
    //   pubKey,
    //   /** The callback passes the challenge back to the client */
    //   (challenge: Uint8Array) => {
    //     return new Promise((resolve, reject) => {
    //       /** Pass the challenge to the client */
    //       return resolve(Buffer.from(challenge));
    //     });
    //   },
    // );

    // console.log({ token });

    // const auth = await getAPISig();
    // /** Include the token in the auth payload */
    // const credentials: UserAuth = {
    //   ...auth,
    //   key: process.env.USER_API_KEY,
    // };

    return 'token';
  }
}
