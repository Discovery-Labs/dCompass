export const ContributorsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "ContributorsList",
  type: "array",
  items: {
    type: "object",
    title: "ContributorItem",
    properties: {
      id: {
        type: "string",
      },
    },
  },
};
