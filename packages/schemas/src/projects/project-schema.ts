export const projectProperties = {
  _id: {
    type: "string",
  },
  streamId: {
    type: "string",
  },
  name: {
    type: "string",
    title: "name",
    maxLength: 100,
  },
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
  contracts: {
    type: "array",
    items: {
      type: "string",
      title: "ContractAddress",
    },
  },
  repos: {
    type: "array",
    items: {
      $ref: "#/definitions/CeramicStreamId",
    },
  },
  pathways: {
    type: "array",
    title: "pathways",
    items: {
      type: "string",
    },
  },
  members: {
    type: "array",
    title: "members",
    items: {
      $ref: "#/definitions/CeramicStreamId",
    },
  },
  pendingPathways: {
    type: "array",
    title: "pendingPathways",
    items: {
      type: "string",
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
  createdBy: {
    type: "string",
    maxLength: 42,
  },
  updatedBy: {
    type: "string",
    maxLength: 42,
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
  tags: {
    type: "array",
    title: "tags",
    items: {
      type: "object",
      title: "TagItem",
      properties: {
        _id: {
          type: "string",
        },
      },
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
          type: "string",
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
  parentProjectId: {
    type: "string",
  },
  childProjects: {
    type: "array",
    items: {
      type: "string",
    },
  },
};

export const ProjectSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Project",
  type: "object",
  properties: projectProperties,
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
