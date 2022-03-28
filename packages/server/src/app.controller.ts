import { Body, Controller, Post } from '@nestjs/common';
import { getAPISig, newClientDB } from './core/resources/ThreadDB/thread-db';
import { PrivateKey, UserAuth } from '@textile/hub';
import { ForbiddenError } from 'apollo-server-express';

@Controller()
export class AppController {
  @Post('/token')
  async getTokenChallenge(
    @Body() { privateIdentity }: { privateIdentity: string },
  ): Promise<{ userAuth: UserAuth }> {
    if (!privateIdentity) {
      throw new Error('Private Identity is missing');
    }
    if (!process.env.THREAD_DB_USER_GROUP_KEY) {
      throw new Error(
        'Environment variable THREAD_DB_USER_GROUP_KEY is missing',
      );
    }
    const restoredIdentity = PrivateKey.fromString(privateIdentity);

    /**
     * Init new Hub API Client
     */
    const db = await newClientDB(restoredIdentity);
    const token = await db.getTokenChallenge(
      restoredIdentity.public.toString(),
      /** The callback passes the challenge back to the client */
      (challenge: Uint8Array) => {
        return new Promise((resolve, reject) => {
          return resolve(restoredIdentity.sign(challenge));
        });
      },
    );

    if (!token) {
      throw new ForbiddenError('Invalid token');
    }

    /** Get API authorization for the user */
    const auth = await getAPISig();

    /** Include the token in the auth payload */
    const userAuth: UserAuth = {
      ...auth,
      token: token,
      key: process.env.THREAD_DB_USER_GROUP_KEY,
    };

    console.log({ token });

    console.log({ dbs: await db.listDBs(), threads: await db.listThreads() });

    return { userAuth };
  }
}
