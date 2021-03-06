// import { CeramicClient } from "@ceramicnetwork/http-client";
// import { DID } from "dids";
// import { Ed25519Provider } from "key-did-provider-ed25519";
// import { getResolver } from "key-did-resolver";
// import { fromString, toString } from "uint8arrays";
// import { randomBytes } from "@stablelib/random";
// // The key must be provided as an environment variable
// import { DataModel } from "@glazed/datamodel";
// import { DIDDataStore } from "@glazed/did-datastore";
// import { Core } from "@self.id/core";

// import publishedModel from "@discovery-dao/schemas/lib/model.json";
// // import Box from '3box';
// // import { legacy3BoxToCeramic } from './legacy3BoxToCeramic';

// // READ ONLY CLIENT
// export const ceramicCoreFactory = () => {
//   const core = new Core({
//     ceramic: CERAMIC_TESTNET,
//     aliases: publishedModel,
//   });
//   return core;
// };

// // DATA MODEL CLIENT
// export const ceramicDataModelFactory = async () => {
//   if (!process.env.DID_KEY) {
//     console.warn("DID_KEY not found in .env, generating a new seed..");
//     const newSeed = toString(randomBytes(32), "base16");
//     console.log(`Seed generated. Save this in your .env as DID_KEY=${newSeed}`);
//     process.env.DID_KEY = newSeed;
//   }
//   const key = fromString(process.env.DID_KEY, "base16");
//   // Create and authenticate the DID
//   const did = new DID({
//     provider: new Ed25519Provider(key),
//     resolver: getResolver(),
//   });
//   await did.authenticate();

//   // Connect to the testnet local Ceramic node
//   const ceramic = new CeramicClient(CERAMIC_TESTNET_NODE_URL) as any;
//   ceramic.did = did;
//   const model = new DataModel({ ceramic, model: publishedModel });
//   const dataStore = new DIDDataStore({ ceramic, model });
//   return { dataStore, model, ceramic };
// };

// // export const migrateGitcoinProfile = async (address: string) => {
// //   const self = await SelfID.authenticate({
// //     authProvider: new EthereumAuthProvider(window.ethereum, address),
// //     ceramic: 'testnet-clay',
// //     connectNetwork: 'testnet-clay',
// //   });
// //   const { publicData, privateData, legacyProfile } = await legacy3BoxToCeramic(
// //     address,
// //     window.ethereum,
// //   );
// //   if (publicData) {
// //     console.log(publicData, privateData);
// //     const newProfile = await self.set('basicProfile', {
// //       name: publicData.full_name,
// //       description: legacyProfile.description,
// //       // TODO: download image and ask if they want to use this
// //       // image: publicData.avatar_url,
// //     });
// //   }
// // };
