import {
  Client,
  Identity,
  PrivateKey,
  DBInfo,
  ThreadID,
  UserAuth,
} from "@textile/hub";

export const getIdentity = (key?: string) => {
  if (!key) {
    throw new Error("No key!");
  }
  const identity = PrivateKey.fromString(key);
  return identity;
};

export const getPrivateIdentity = async (self: any) => {
  const restoredIdentity = await self.get("UserPrivateIdentity");
  if (restoredIdentity?.privateIdentity) {
    /** Convert the cached identity string to a PrivateKey and return */
    return PrivateKey.fromString(restoredIdentity.privateIdentity);
  }
  /** New identity based on DID */
  const identity = PrivateKey.fromString(self.id);
  await self.set("UserPrivateIdentity", {
    privateIdentity: identity.toString(),
  });
  console.log({ identity });
  return identity;
};

export const sign = (identity: PrivateKey, msg: string) => {
  const challenge = Buffer.from(msg);
  const credentials = identity.sign(challenge);
  return credentials;
};

export const getUserThreadClient = (auth: UserAuth, did: string) => {
  const user = getIdentity(did);
  console.log({ user });
  const client = Client.withUserAuth(auth);
  return client;
};

export const getAuthorizedDevClient = async (identity: Identity) => {
  if (!process.env.THREAD_DB_KEY || !process.env.THREAD_DB_SECRET) {
    throw new Error(
      "Environment variables THREAD_DB_KEY & THREAD_DB_SECRET missing."
    );
  }
  const auth = {
    key: process.env.THREAD_DB_KEY,
    secret: process.env.THREAD_DB_SECRET,
  };
  const client = await Client.withKeyInfo(auth);
  await client.getToken(identity);
  return client;
};

export const newToken = async (client: Client, user: PrivateKey) => {
  const token = await client.getToken(user);
  return token;
};

export const createDB = async (client: Client) => {
  const thread: ThreadID = await client.newDB();
  return thread;
};

// TODO: Invite users to the same thread
export const getInfo = async (client: Client, threadID: ThreadID) => {
  return client.getDBInfo(threadID);
};

export const joinFromInfo = async (client: Client, info: DBInfo) => {
  return client.joinFromInfo(info);
};
