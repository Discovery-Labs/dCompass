const {
  Client,
  Identity,
  PrivateKey,
  DBInfo,
  ThreadID,
  UserAuth,
} = require("@textile/hub");

async function getThreadClient(auth) {
  const user = await PrivateKey.fromRandom();
  const client = await Client.withUserAuth(auth);
  return client;
}

async function newToken(client, user) {
  const token = await client.getToken(user);
  return token;
}

async function createDB(client) {
  const thread = await client.newDB();
  return thread;
}

async function newCollectionFromSchema({
  client,
  threadID,
  schema,
  schemaName,
}) {
  return client.newCollection(threadID, { name: schemaName, schema: schema });
}
// Get all Instances
async function findEntity(client, threadId, collection) {
  const found = await client.find(threadId, collection, {});
  console.debug("found:", found.length);
}

// Add an Instance
async function create(client, threadId, collection, data) {
  const createdData = await client.create(threadId, collection, data);
  return createdData;
}

// Query - Requires the started database we generated above containing the Player collection
async function createQuery(client, threadID, collection, query) {
  // Get results
  const all = await client.find(threadID, collection, query);
  return all;
}

// ACL: https://github.com/textileio/go-threads/issues/295
// Subscribe: https://docs.textile.io/threads/#listen
// TODO: Invite users to the same thread
async function getThreadInfo(client, threadID) {
  return await client.getDBInfo(threadID);
}

async function joinFromInfo(client, info) {
  return await client.joinFromInfo(info);
}

async function getIdentity(did) {
  let identity;
  try {
    if (!did) {
      throw new Error("No did!");
    }
    identity = await PrivateKey.fromString(did);
    console.log({ identity });
    return identity;
  } catch (e) {
    throw e;
  }
}

async function getAuthorizedDevClient(identity) {
  const auth = {
    key: process.env.THREAD_DB_KEY,
    secret: process.env.THREAD_DB_SECRET,
  };
  const client = await Client.withKeyInfo(auth);
  await client.getToken(identity);
  return client;
}

module.exports = {
  getIdentity,
  getAuthorizedDevClient,
  createDB,
  newCollectionFromSchema,
  getThreadInfo,
};
