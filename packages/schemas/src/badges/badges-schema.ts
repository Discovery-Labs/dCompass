export const BadgesSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "BadgesList",
  type: "object",
  properties: {
    badges: {
      type: "array",
      title: "badges",
      items: {
        type: "object",
        title: "BadgeItem",
        properties: {
          id: {
            $ref: "#/definitions/CeramicStreamId",
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
