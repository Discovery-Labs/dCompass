import { projectProperties } from "./project-schema";

export const AppProjectsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "AppProjectsList",
  type: "object",
  properties: {
    projects: {
      type: "array",
      title: "projects",
      items: {
        type: "object",
        title: "project",
        properties: {
          ...projectProperties,
          pendingPathways: {
            type: "array",
            title: "pending pathways",
            items: {
              $ref: "#/definitions/CeramicStreamId",
            },
          },
          pendingMembers: {
            type: "array",
            title: "pending members",
            items: {
              $ref: "#/definitions/CeramicStreamId",
            },
          },
          tokenUris: {
            type: "array",
            items: {
              type: "string",
            },
          },
          isFeatured: {
            type: "boolean",
          },
        },
      },
    },
  },
  definitions: {
    CeramicStreamId: {
      type: "string",
      pattern: "^ceramic://.+(\\\\?version=.+)?",
      maxLength: 150,
    },
  },
};
