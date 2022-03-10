import {
  Client,
  Identity,
  PrivateKey,
  DBInfo,
  ThreadID,
  UserAuth,
} from "@textile/hub";

async function getThreadClient(auth: UserAuth) {
  const user = await PrivateKey.fromRandom();

  const client = await Client.withUserAuth(auth);

  return client;
}

async function newToken(client: Client, user: PrivateKey) {
  const token = await client.getToken(user);
  return token;
}

async function createDB(client: Client) {
  const thread: ThreadID = await client.newDB();
  return thread;
}

// TODO: Invite users to the same thread
async function getInfo(client: Client, threadID: ThreadID): Promise<DBInfo> {
  return await client.getDBInfo(threadID);
}

async function joinFromInfo(client: Client, info: DBInfo) {
  return await client.joinFromInfo(info);
}
