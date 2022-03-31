import {
  Client,
  PrivateKey,
  DBInfo,
  ThreadID,
  UserAuth,
  createAPISig,
} from '@textile/hub';

export const getIdentity = (key?: string) => {
  if (!key) {
    throw new Error('No key!');
  }
  const identity = PrivateKey.fromString(key);
  return identity;
};

export const getPrivateIdentity = async (self: any) => {
  const restoredIdentity = await self.get('@dCompass/userprivateidentity');
  if (restoredIdentity?.privateIdentity) {
    /** Convert the cached identity string to a PrivateKey and return */
    return PrivateKey.fromString(restoredIdentity.privateIdentity);
  }
  /** New identity based on DID */
  const newKey = PrivateKey.fromRandom();
  await self.set('@dCompass/userprivateidentity', {
    _id: self.id,
    privateIdentity: newKey.toString(),
  });
  return newKey;
};

export const sign = (identity: PrivateKey, msg: string) => {
  const challenge = Buffer.from(msg);
  const credentials = identity.sign(challenge);
  return credentials;
};

export const getDBClient = async () => {
  if (!process.env.THREAD_DB_IDENTITY_KEY) {
    throw new Error('Missing environment variable THREAD_DB_IDENTITY_KEY');
  }
  const threadDBIdentity = getIdentity(process.env.THREAD_DB_IDENTITY_KEY);
  if (!process.env.THREAD_DB_USER_GROUP_KEY) {
    throw new Error(
      'Missing environment variable NEXT_PUBLIC_THREAD_DB_IDENTITY_KEY',
    );
  }
  const client = await Client.withKeyInfo({
    key: process.env.THREAD_DB_USER_GROUP_KEY,
    secret: process.env.THREAD_DB_USER_GROUP_SECRET,
  });
  await client.getToken(threadDBIdentity);
  return client;
};

export const getUserThreadClient = (auth: UserAuth, did: string) => {
  const user = getIdentity(did);
  console.log({ user });
  const client = Client.withUserAuth(auth);
  return client;
};

// export const getAuthorizedUserClient = async (identity: PrivateKey) => {
//   // Check for user group keys
//   if (!process.env.THREAD_DB_USER_GROUP_KEY) {
//     throw new Error('Environment variables THREAD_DB_USER_GROUP_KEY missing.');
//   }

//   // TODO: Call api
//   const apiSig = await getAPISig();

//   if (!apiSig) {
//     throw new Error('Error API signature');
//   }

//   const userAuth = {
//     ...apiSig,
//     key: process.env.THREAD_DB_USER_GROUP_KEY,
//     // token: token,
//   } as UserAuth;

//   const client = Client.withUserAuth(userAuth);
//   return client;
// };

// export const getAuthorizedClient = async (publicKey: string) => {
//   // Check for user group keys
//   if (!process.env.THREAD_DB_KEY || !process.env.THREAD_DB_SECRET) {
//     throw new Error(
//       'Environment variables THREAD_DB_KEY & THREAD_DB_SECRET missing.',
//     );
//   }
//   const auth = {
//     key: process.env.THREAD_DB_KEY,
//     secret: process.env.THREAD_DB_SECRET,
//   };
//   const client = await Client.withKeyInfo(auth);
//   // await client.getToken(identity);
//   return client;
// };
// export const getAuthorizedDevClient = async (identity: Identity) => {
//   // Check for user group keys
//   if (!process.env.THREAD_DB_KEY || !process.env.THREAD_DB_SECRET) {
//     throw new Error(
//       'Environment variables THREAD_DB_KEY & THREAD_DB_SECRET missing.',
//     );
//   }
//   const auth = {
//     key: process.env.THREAD_DB_KEY,
//     secret: process.env.THREAD_DB_SECRET,
//   };
//   const client = await Client.withKeyInfo(auth);
//   return client;
// };

export const getAPISig = async (seconds = 300) => {
  // Check for user group secret
  if (!process.env.THREAD_DB_USER_GROUP_SECRET) {
    throw new Error(
      'Environment variables THREAD_DB_USER_GROUP_SECRET missing.',
    );
  }
  const expiration = new Date(Date.now() + 1000 * seconds);
  return await createAPISig(
    process.env.THREAD_DB_USER_GROUP_SECRET,
    expiration,
  );
};

export const newToken = async (client: Client, user: PrivateKey) => {
  const token = await client.getToken(user);
  return token;
};

export const createDB = async (client: Client) => {
  const thread: ThreadID = await client.newDB();
  return thread;
};

/**
 * newClientDB creates a Client (remote DB) connection to the Hub
 *
 * A Hub connection is required to use the getToken API
 */
export const newClientDB = async (identity: PrivateKey) => {
  // Check for user group keys
  if (
    !process.env.THREAD_DB_USER_GROUP_KEY ||
    !process.env.THREAD_DB_USER_GROUP_SECRET
  ) {
    throw new Error(
      'Environment variables THREAD_DB_USER_GROUP_KEY or THREAD_DB_USER_GROUP_SECRET missing.',
    );
  }
  const db = await Client.withKeyInfo({
    key: process.env.THREAD_DB_USER_GROUP_KEY,
    secret: process.env.THREAD_DB_USER_GROUP_SECRET,
  });
  await db.getToken(identity);

  return db;
};

// TODO: Invite users to the same thread
export const getInfo = async (client: Client, threadID: ThreadID) => {
  return client.getDBInfo(threadID);
};

export const joinFromInfo = async (client: Client, info: DBInfo) => {
  return client.joinFromInfo(info);
};