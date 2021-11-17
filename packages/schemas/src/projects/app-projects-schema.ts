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
          id: {
            $ref: "#/definitions/CeramicStreamId",
          },
          tokenUri: {
            type: "string",
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
