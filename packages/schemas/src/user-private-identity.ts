export const UserPrivateIdentitySchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "UserPrivateIdentity",
  type: "object",
  properties: {
    _id: {
      type: "string",
    },
    privateIdentity: {
      type: "string",
    },
    token: {
      type: "string",
    },
  },
};
