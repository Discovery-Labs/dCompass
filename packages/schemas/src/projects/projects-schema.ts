export const ProjectsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ProjectsList',
  type: 'object',
  properties: {
    projects: {
      type: 'array',
      title: 'projects',
      items: {
        type: 'object',
        title: 'ProjectItem',
        properties: {
          id: {
            $ref: '#/definitions/CeramicStreamId',
          },
          name: {
            type: 'string',
            title: 'name',
            maxLength: 100,
          },
          courses: {
            type: 'array',
            title: 'courses',
            items: {
              type: 'object',
              title: 'CourseItem',
              properties: {
                id: {
                  $ref: '#/definitions/CeramicStreamId',
                },
                title: {
                  type: 'string',
                  title: 'title',
                  maxLength: 100,
                },
              },
            },
          },
          tags: {
            type: 'array',
            title: 'tags',
            items: {
              type: 'object',
              title: 'TagItem',
              properties: {
                id: {
                  $ref: '#/definitions/CeramicStreamId',
                },
                name: {
                  type: 'string',
                  title: 'name',
                  maxLength: 100,
                },
              },
            },
          }
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