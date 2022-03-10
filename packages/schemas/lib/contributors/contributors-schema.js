"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContributorsSchema = void 0;
exports.ContributorsSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "ContributorsList",
    type: "array",
    items: {
        type: "object",
        title: "ContributorItem",
        properties: {
            id: {
                type: "string",
            },
        },
    },
};
//# sourceMappingURL=contributors-schema.js.map