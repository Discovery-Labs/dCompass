import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { schemaAliases } from "../../../core/constants/idx";
import { UseCeramic } from "../../../core/decorators/UseCeramic.decorator";
import { UseCeramicClient } from "../../../core/utils/types";
import { CreateTagInput } from "../dto/CreateTag.input";
import { Tag } from "../Tag.entity";

export type TagItem = {
  id: string;
  name: string;
  pathwayId: string;
  completedBy: string[];
};

export type TagsList = { tags: Array<TagItem> };
@Resolver(() => Tag)
export class CreateTagResolver {
  @Mutation(() => Tag, {
    nullable: true,
    description: "Create a new Tag in Discovery",
    name: "createTag",
  })
  async createTag(
    @UseCeramic() { ceramicClient }: UseCeramicClient,
    @Args("input") tag: CreateTagInput
  ): Promise<Tag | null | undefined> {
    const createdTag = await ceramicClient.model.createTile(
      schemaAliases.TAG_ALIAS,
      tag
    );
    if (!createdTag) {
      return null;
    }

    const existingTags = await ceramicClient.dataStore.get(
      schemaAliases.TAGS_ALIAS
    );
    const tags = existingTags?.tags ?? [];

    await ceramicClient.dataStore.set("tags", {
      tags: [
        {
          id: createdTag.id.toUrl(),
        },
        ...tags,
      ],
    });

    return {
      id: createdTag.id.toUrl(),
      ...createdTag.content,
    };
  }
}
