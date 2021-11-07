export const TagSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Tag',
  description: 'A Tag covers an ecosystem or a set of topics',
  type: 'object',
  properties: {
    createdAt: {
      type: 'string',
      format: 'date-time',
      maxLength: 30,
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      maxLength: 30,
    },
    description: {
      type: 'string',
    },
    color: {
      type: 'string'
    }
  },
}