require("dotenv").config();
const { promises } = require("fs");
const { ModelManager } = require("@glazed/devtools");
const { CeramicClient } = require("@ceramicnetwork/http-client");
const { DID } = require("dids");
const { Ed25519Provider } = require("key-did-provider-ed25519");
const { getResolver } = require("key-did-resolver");
const { fromString } = require("uint8arrays");
const basicProfile = require("@datamodels/identity-profile-basic");
const cryptoAccounts = require("@datamodels/identity-accounts-crypto");
const webAccounts = require("@datamodels/identity-accounts-web");
const { DataModel } = require("@glazed/datamodel");
const { DIDDataStore } = require("@glazed/did-datastore");
const { TileDocument } = require("@ceramicnetwork/stream-tile");

const { schemas } = require("./lib/schemas");
const {
  createDB,
  newCollectionFromSchema,
  getAuthorizedDevClient,
  getIdentity,
  getThreadInfo,
} = require("./thread-db");

const { writeFile } = promises;

const schemaAliases = {
  APP_PROJECTS_ALIAS: "@dCompass/appprojects",
  PROJECTS_ALIAS: "@dCompass/projects",
  PATHWAY_ALIAS: "@dCompass/pathway",
  PATHWAYS_ALIAS: "@dCompass/pathways",
  QUESTS_ALIAS: "@dCompass/quests",
  TAG_ALIAS: "@dCompass/tag",
  TAGS_ALIAS: "@dCompass/tags",
  LEARNERS_ALIAS: "@dCompass/learners",
  REPOS_ALIAS: "@dCompass/repos",
  CONTRIBUTORS_ALIAS: "@dCompass/contributors",
};

const createModels = async () => {
  // The key must be provided as an environment variable
  const key = fromString(process.env.DID_KEY || "", "base16");
  // Create and authenticate the DID
  const did = new DID({
    provider: new Ed25519Provider(key),
    resolver: getResolver(),
  });
  await did.authenticate();

  const appJWS = await did.createDagJWS({
    dapp: "dCompass",
  });

  const dappIdentity = getIdentity(process.env.THREAD_DB_IDENTITY_KEY);
  const threadDBClient = await getAuthorizedDevClient(dappIdentity);

  console.log({ threadDBClient });
  // TODO: db versionning
  const dCompassThreadId = await createDB(threadDBClient);
  console.log({ dCompassThreadId });

  // Connect to the testnet local Ceramic node
  const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com"); // "http://localhost:7007"
  ceramic.did = did;

  // Create a manager for the model
  const manager = new ModelManager(ceramic);

  manager.addJSONModel(basicProfile.model);
  manager.addJSONModel(cryptoAccounts.model);
  manager.addJSONModel(webAccounts.model);
  for (const [schemaName, schema] of Object.entries(schemas.dCompass)) {
    console.log({ schema });
    const createdSchemaID = await manager.createSchema(schemaName, schema);
    // Create the definition using the created schema ID
    if (createdSchemaID) {
      const schemaURL = manager.getSchemaURL(createdSchemaID);
      if (!schemaURL) {
        throw new Error("Error - manager.getSchemaURL");
      }
      const definition = await manager.createDefinition(
        "@dCompass/" + schemaName.toLowerCase(),
        {
          name: "@dCompass/" + schemaName.toLowerCase(),
          description: `dCompass schema definition for ${schemaName}.`,
          schema: schemaURL,
        }
      );
      console.log({ definition });
    }

    if (!schema.title.toLocaleLowerCase().includes("list")) {
      const createdCollection = await newCollectionFromSchema({
        client: threadDBClient,
        threadID: dCompassThreadId,
        schema,
        schemaName,
      });
      const dbInfo = await getThreadInfo(threadDBClient, dCompassThreadId);
      console.log({ dbInfo, createdCollection });
    }
  }
  // Publish model to Ceramic node
  const publishedModel = await manager.toPublished();
  const model = new DataModel({ ceramic, model: publishedModel });
  const dataStore = new DIDDataStore({ ceramic, model });

  // Create tags
  const tags = [
    { value: "dao", label: "DAO", color: "blue" },
    { value: "blockchain", label: "Blockchain", color: "yellow" },
    { label: "Tooling", value: "tooling", color: "teal" },
    { label: "Wallets", value: "wallets", color: "orange" },
    { label: "Scaling solutions", value: "scaling-solutions", color: "red" },
    { label: "Storage", value: "storage", color: "cyan" },
    { label: "NFT", value: "nft", color: "purple" },
    { label: "DeFi", value: "defi", color: "green" },
    { label: "Security", value: "security", color: "gray" },
    { label: "DEX", value: "dex", color: "green" },
    { label: "Oracles", value: "oracles", color: "blue" },
    { label: "Play to earn", value: "play-to-earn", color: "purple" },
    { label: "Learn to earn", value: "learn-to-earn", color: "yellow" },
    { label: "Build to earn", value: "build-to-earn", color: "orange" },
  ];

  await threadDBClient.create(dCompassThreadId, "Tag", tags);

  // Write published model to JSON file
  await writeFile("./lib/model.json", JSON.stringify(publishedModel));
  return { model: publishedModel, manager, ceramic };
};
(async () => {
  await createModels();
})();
