export const QuestsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'QuestsList',
  type: 'object',
  properties: {
    quests: {
      type: 'array',
      title: 'quests',
      items: {
        type: 'object',
        title: 'QuestItem',
        properties: {
          id: {
            $ref: '#/definitions/CeramicStreamId',
          },
          name: {
            type: 'string',
            title: 'name',
            maxLength: 100,
          },
          courseId: {
            $ref: '#/definitions/CeramicStreamId',
          },
          completedBy: {
            type: 'array',
            title: 'completedBy',
            items: {
              type: 'string',
            }
          },
        },
      },
    },
  },
  definitions: {
    CeramicStreamId: {
      type: 'string',
      pattern: '^ceramic://.+(\\\\?version=.+)?',
      maxLength: 150,
    },
  },
}