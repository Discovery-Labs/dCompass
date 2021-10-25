import { Contributors } from "./contributors/contributors-schema";
import { TagSchema } from "./tags/tag-schema";
import { TagsSchema } from "./tags/tags-schema";

export const schemas = {
  dProfiles: {
    Contributors: Contributors,
    Tags: TagsSchema,
    Tag: TagSchema,
  },
};
