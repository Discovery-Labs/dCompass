export const ProjectSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Project",
  type: "object",
  properties: {
    color: {
      type: "string",
    },
    whitepaper: {
      type: "string",
    },
    website: {
      type: "string",
    },
    twitter: {
      type: "string",
    },
    discord: {
      type: "string",
    },
    github: {
      type: "string",
    },
    description: {
      type: "string",
    },
    logo: {
      type: "string",
    },
    contract_address: {
      type: "string",
    },
    is_featured: {
      type: "boolean",
    },
    repos: {
      type: "array",
      items: {
        $ref: "#/definitions/CeramicStreamId",
      },
    },
    squads: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          image: {
            $ref: "#/definitions/imageSources",
          },
          members: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    },
    peerProjects: {
      type: "array",
      items: {
        $ref: "#/definitions/CeramicStreamId",
      },
    },
  },
  definitions: {
    IPFSUrl: {
      type: "string",
      pattern: "^ipfs://.+",
      maxLength: 150,
    },
    positiveInteger: {
      type: "integer",
      minimum: 1,
    },
    imageMetadata: {
      type: "object",
      properties: {
        src: {
          $ref: "#/definitions/IPFSUrl",
        },
        mimeType: {
          type: "string",
          maxLength: 50,
        },
        width: {
          $ref: "#/definitions/positiveInteger",
        },
        height: {
          $ref: "#/definitions/positiveInteger",
        },
        size: {
          $ref: "#/definitions/positiveInteger",
        },
      },
      required: ["src", "mimeType", "width", "height"],
    },
    imageSources: {
      type: "object",
      properties: {
        original: {
          $ref: "#/definitions/imageMetadata",
        },
        alternatives: {
          type: "array",
          items: {
            $ref: "#/definitions/imageMetadata",
          },
        },
      },
      required: ["original"],
    },
    CeramicStreamId: {
      type: "string",
      pattern: "^ceramic://.+(\\\\?version=.+)?",
      maxLength: 150,
    },
  },
};
