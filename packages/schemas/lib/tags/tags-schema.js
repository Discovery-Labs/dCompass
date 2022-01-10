"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsSchema = void 0;
exports.TagsSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "TagsList",
    type: "object",
    properties: {
        tags: {
            type: "array",
            title: "tags",
            items: {
                $ref: "#/definitions/CeramicStreamId",
            },
        },
    },
    definitions: {
        CeramicStreamId: {
            type: "string",
            pattern: "^ceramic://.+(\\\\?version=.+)?",
            maxLength: 150,
        },
    },
};
//# sourceMappingURL=tags-schema.js.map