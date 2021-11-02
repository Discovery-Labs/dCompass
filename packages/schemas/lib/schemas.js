"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const contributors_schema_1 = require("./contributors/contributors-schema");
const tag_schema_1 = require("./tags/tag-schema");
const tags_schema_1 = require("./tags/tags-schema");
exports.schemas = {
    dProfiles: {
        Contributors: contributors_schema_1.Contributors,
        Tags: tags_schema_1.TagsSchema,
        Tag: tag_schema_1.TagSchema,
    },
};
//# sourceMappingURL=schemas.js.map