// app.service.ts
import { Injectable } from "@nestjs/common";
import type { CeramicClient } from "@ceramicnetwork/http-client";
import type { Core } from "@self.id/core";
import { randomBytes } from "@stablelib/random";
import { fromString, toString } from "uint8arrays";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";

import publishedModel from "@discovery-dao/schemas/lib/model.json";

@Injectable()
export class CeramicService {
  constructor(
    private ceramicClient: CeramicClient,
    private ceramicCore: Core,
    private ceramicDataModel: any,
    private ceramicDIDDataStore: any
  ) {}

  getClient(): CeramicClient {
    return this.ceramicClient;
  }
  // READ ONLY CLIENT
  getCore(): Core {
    return this.ceramicCore;
  }

  async ceramicDataModelFactory() {
    // The key must be provided as an environment variable
    if (!process.env.DID_KEY) {
      console.warn("DID_KEY not found in .env, generating a new seed..");
      const newSeed = toString(randomBytes(32), "base16");
      console.log(
        `Seed generated. Save this in your .env as DID_KEY=${newSeed}`
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
    const ceramic = this.getClient();
    ceramic.did = did;
    const model = new this.ceramicDataModel.DataModel({
      ceramic,
      aliases: publishedModel,
    });
    const dataStore = new this.ceramicDIDDataStore.DIDDataStore({
      ceramic,
      model,
    });
    return { dataStore, model, ceramic };
  }
}
