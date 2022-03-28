export const PathwaysSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "PathwaysList",
  type: "object",
  properties: {
    pathways: {
      type: "array",
      title: "pathways",
      items: {
        type: "object",
        title: "PathwayItem",
        properties: {
          id: {
            type: "string",
          },
        },
      },
    },
  },
};
