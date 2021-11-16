export const ProjectsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "ProjectsList",
  type: "object",
  properties: {
    projects: {
      type: "array",
      title: "projects",
      items: {
        $ref: "#/definitions/CeramicStreamId",
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
