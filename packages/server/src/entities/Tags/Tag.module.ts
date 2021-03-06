import { Module } from "@nestjs/common";

import { RedisModule } from "../../core/resources/Redis/Redis.module";

import { GetAllTagsResolver } from "./queries/GetAllTags.resolver";
// import { CreateTagResolver } from './mutations/CreateTag.resolver';
// import { CreateTagsResolver } from './mutations/CreateTags.resolver';
import { TagService } from "./Tag.service";
import { PrismaService } from "../../services/prisma/Prisma.service";

@Module({
  imports: [RedisModule],
  providers: [
    GetAllTagsResolver,
    // CreateTagResolver,
    // CreateTagsResolver,
    PrismaService,
    TagService,
  ],
  exports: [],
})
export class TagModule {}
