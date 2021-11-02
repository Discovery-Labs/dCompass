"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsSchema = void 0;
exports.TagsSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'TagsList',
    type: 'object',
    properties: {
        tags: {
            type: 'array',
            title: 'tags',
            items: {
                type: 'object',
                title: 'tagItem',
                properties: {
                    id: {
                        $ref: '#/definitions/CeramicStreamId',
                    },
                    name: {
                        type: 'string',
                        title: 'name',
                        maxLength: 100
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
};
//# sourceMappingURL=tags-schema.js.map