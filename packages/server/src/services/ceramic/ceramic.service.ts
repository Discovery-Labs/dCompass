import CeramicClient from '@ceramicnetwork/http-client';
import KeyDidResolver from 'key-did-resolver';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { promises } from 'fs';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { DID } from 'dids';
import { IDX } from '@ceramicstudio/idx';
import { createDefinition, publishSchema } from '@ceramicstudio/idx-tools';
import { fromString, toString } from 'uint8arrays';
import { randomBytes } from '@stablelib/random';
import { schemas } from '@discovery-dao/schemas';
import { Logger } from '@nestjs/common';
import { CreateCeramicDocumentInput } from './types';
import config from '../../core/configs/config';
export interface CeramicInstanceDependency {
  ceramic: CeramicClient;
  idx: IDX;
  schemasCommitId: Record<string, string>;
}
export async function makeCeramicClient() {
  const ceramicConfigJson = await promises.readFile('./src/config.json');
  const ceramicConfig = JSON.parse(ceramicConfigJson.toString());
  // The seed must be provided as an environment variable
  if (!process.env.CERAMIC_SEED) {
    Logger.warn('NO CERAMIC SEED, A NEW ONE WILL BE GENERATED');
    process.env.CERAMIC_SEED = toString(randomBytes(32), 'base16');
  }
  // Connect to the local Ceramic node
  const ceramic = new CeramicClient(config().ceramic.apiUrl);
  // Authenticate the Ceramic instance with the provider
  const keyDidResolver = KeyDidResolver.getResolver();
  const threeIdResolver = ThreeIdResolver.getResolver(ceramic);
  const resolverRegistry = {
    ...threeIdResolver,
    ...keyDidResolver,
  };
  const did = new DID({
    provider: new Ed25519Provider(fromString(config().ceramic.seed, 'base16')),
    resolver: resolverRegistry,
  });
  await did.authenticate();
  await ceramic.setDID(did);

  if (
    config().ceramic.forceSync ||
    Object.keys(ceramicConfig.schemas).length === 0 ||
    Object.keys(ceramicConfig.definitions).length === 0
  ) {
    process.env.CERAMIC_FORCE_SYNC = 'false';
    // Publish all the schemas and create their definitions referenced by an alias
    const aliases = {} as Record<string, string>;
    const schemasCommitId = {} as Record<string, string>;

    for (const [schemaName, schema] of Object.entries(schemas.dCompass)) {
      const publishedSchema = await publishSchema(ceramic, {
        content: schema,
        name: schemaName,
      });
      const publishedSchemaCommitId = publishedSchema.commitId.toUrl();
      schemasCommitId[schemaName] = publishedSchemaCommitId;

      const createdDefinition = await createDefinition(ceramic, {
        name: schemaName,
        description: `Discovery schema for ${schemaName}`,
        schema: publishedSchemaCommitId,
      });
      aliases[schemaName] = createdDefinition.id.toString();
    }

    // Write config to JSON file
    const config = {
      definitions: aliases,
      schemas: schemasCommitId,
    };
    await promises.writeFile('./src/config.json', JSON.stringify(config));
    const idx = new IDX({ ceramic, aliases });
    return { ceramic, idx, schemasCommitId };
  }

  const idx = new IDX({ ceramic, aliases: ceramicConfig.definitions });
  return { ceramic, idx, schemasCommitId: ceramicConfig.schemas };
}

export async function createCeramicDocument(
  { ceramic, idx }: CeramicInstanceDependency,
  { data, family, schema }: CreateCeramicDocumentInput,
) {
  try {
    if (!ceramic) {
      return null;
    }
    const doc = await TileDocument.create(ceramic, data, {
      controllers: ceramic?.did?.id ? [ceramic?.did?.id] : [],
      family,
      schema,
    });
    const streamId = doc.id.toString();
    return { streamId, doc };
  } catch (error) {
    console.log({ createCeramicDocumentError: error });
    throw error;
  }
}

export async function readCeramicRecord(
  { idx }: CeramicInstanceDependency,
  alias: string,
  DID_OR_CAIP10_ID?: string,
) {
  try {
    return await idx.get(alias, DID_OR_CAIP10_ID);
  } catch (error) {
    console.log({ readCeramicRecordError: error });
    throw error;
  }
}

export async function getCeramicAlias(
  { idx }: CeramicInstanceDependency,
  alias: string,
) {
  try {
    return await idx.get(alias); // uses authenticated DID
  } catch (error) {
    console.log({ getCeramicAliasError: error });
    throw error;
  }
}
