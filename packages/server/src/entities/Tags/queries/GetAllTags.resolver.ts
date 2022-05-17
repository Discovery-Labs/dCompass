import { Resolver, Query } from "@nestjs/graphql";

import { Tag } from "../Tag.entity";
import { TagService } from "../Tag.service";

@Resolver(() => [Tag])
export class GetAllTagsResolver {
  constructor(private readonly tagService: TagService) {}
  @Query(() => [Tag], {
    nullable: true,
    description: "Gets all the tags in Discovery",
    name: "getAllTags",
  })
  async getAllTags(): Promise<Tag[] | undefined> {
    const allTags = await this.tagService.tags({ take: 100 });

    if (!allTags) {
      return undefined;
    }
    return allTags;
  }
}
