export const TagSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Tag",
  description: "A Tag covers an ecosystem or a set of topics",
  type: "object",
  properties: {
    _id: {
      type: "string",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      maxLength: 30,
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      maxLength: 30,
    },
    label: {
      type: "string",
    },
    value: {
      type: "string",
    },
    color: {
      type: "string",
    },
  },
};
