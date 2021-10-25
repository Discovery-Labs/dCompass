import { CeramicClient } from "@ceramicnetwork/http-client";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString, toString } from "uint8arrays";
import { randomBytes } from "@stablelib/random";
import publishedModel from "@d-profiles/schemas/lib/model.json";
// The key must be provided as an environment variable
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { Core } from "@self.id/core";
import { EthereumAuthProvider, SelfID } from "@self.id/web";
import Box from "3box";
import { legacy3BoxToCeramic } from "./legacy3BoxToCeramic";

declare const window: any;
export const CERAMIC_TESTNET = "testnet-clay";
export const CERAMIC_TESTNET_NODE_URL = "https://ceramic-clay.3boxlabs.com";
export const CERAMIC_MAINNET_NODE_URL = "https://gateway.ceramic.network";
export const CERAMIC_LOCAL_NODE_URL = "http://localhost:7007";

// READ-WRITE CLIENT
export const ceramicAuthFactory = async () => {
  const accounts = await window.ethereum.enable();
  const authProvider = new EthereumAuthProvider(window.ethereum, accounts[0]);
  const self = await SelfID.authenticate({
    authProvider,
    ceramic: CERAMIC_TESTNET,
    connectNetwork: CERAMIC_TESTNET,
    model: publishedModel,
  });
  // A SelfID instance can only be created with an authenticated DID
  return self;
};

// READ ONLY CLIENT
export const ceramicCoreFactory = () => {
  // connect to a known URL
  // const core = new Core({ ceramic: "http://localhost:7007" });
  // or use one of the preconfigured option
  const core = new Core({
    ceramic: CERAMIC_TESTNET,
    model: publishedModel,
  });
  return core;
};

// DATA MODEL CLIENT
export const ceramicDataModelFactory = async () => {
  if (!process.env.DID_KEY) {
    console.warn(
      "REACT_APP_CERAMIC_SEED not found in .env, generating a new seed.."
    );
    const newSeed = toString(randomBytes(32), "base16");
    console.log(
      `Seed generated. Save this in your .env as REACT_APP_CERAMIC_SEED=${newSeed}`
    );
    process.env.DID_KEY = newSeed;
  }
  const key = fromString(process.env.DID_KEY, "base16");
  // Create and authenticate the DID
  const did = new DID({
    provider: new Ed25519Provider(key),
    resolver: getResolver(),
  });
  await did.authenticate();

  // Connect to the testnet local Ceramic node
  const ceramic = new CeramicClient(CERAMIC_TESTNET_NODE_URL) as any;
  ceramic.did = did;
  const model = new DataModel({ ceramic, model: publishedModel });
  const dataStore = new DIDDataStore({ ceramic, model });
  return { dataStore, model, ceramic };
};

export const migrateGitcoinProfile = async (address: string) => {
  const self = await SelfID.authenticate({
    authProvider: new EthereumAuthProvider(window.ethereum, address),
    ceramic: "testnet-clay",
    connectNetwork: "testnet-clay",
  });
  const { publicData, privateData, legacyProfile } = await legacy3BoxToCeramic(
    address,
    window.ethereum
  );
  if (publicData) {
    console.log(publicData, privateData);
    const newProfile = await self.set("basicProfile", {
      name: publicData.full_name,
      description: legacyProfile.description,
      // TODO: download image and ask if they want to use this
      // image: publicData.avatar_url,
    });
  }
};
