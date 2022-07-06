import { AlsoKnownAs, Account } from "@datamodels/identity-accounts-web";
import publishedModel from "@discovery-dao/schemas/lib/model.json";

import { Core } from "@self.id/core";

import { GITHUB_HOST } from "../constants";

export const CERAMIC_TESTNET = "testnet-clay";
export const CERAMIC_TESTNET_NODE_URL = "https://ceramic-clay.3boxlabs.com";
export const CERAMIC_MAINNET_NODE_URL = "https://gateway.ceramic.network";
export const CERAMIC_LOCAL_NODE_URL = "http://localhost:7007";

export const schemaAliases = {
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

// READ ONLY CLIENT
export const ceramicCoreFactory = () => {
  // connect to a known URL
  // const core = new Core({ ceramic: "http://localhost:7007" });
  // or use one of the preconfigured option
  return new Core({
    ceramic: CERAMIC_TESTNET_NODE_URL,
    aliases: publishedModel,
  });
};

export function findGitHub(
  { accounts }: AlsoKnownAs,
  username: string
): Account | undefined {
  return accounts.find((a) => a.host === GITHUB_HOST && a.id === username);
}
export function findGitHubIndex(
  { accounts }: AlsoKnownAs,
  username: string
): number {
  return accounts.findIndex((a) => a.host === GITHUB_HOST && a.id === username);
}
