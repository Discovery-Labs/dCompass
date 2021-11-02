export const ProjectSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Project',
  type: 'object',
  properties: {
    color: {
      type: "string"
    },
    whitepaper: {
      type: "string"
    },
    website: {
      type: "string"
    },
    twitter: {
      type: "string"
    },
    discord: {
      type: "string"
    },
    github: {
      type: "string"
    },
    description: {
      type: "string"
    },
    logo: {
      type: "string"
    },
    contract_address: {
      type: "string"
    },
    is_featured: {
      type: "boolean"
    },
    repos: {
      type: "array",
      items: {
        $ref: "#/definitions/CeramicStreamId"
      }
    },
    peerProjects: {
      type: "array",
      items: {
        $ref: "#/definitions/CeramicStreamId"
      }
    }
  },
  definitions: {
    CeramicStreamId: {
      type: 'string',
      pattern: '^ceramic://.+(\\\\?version=.+)?',
      maxLength: 150,
    },
  },
}
