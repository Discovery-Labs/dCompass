import { Module } from "@nestjs/common";

import { RedisModule } from "../../core/resources/Redis/Redis.module";
import { PrismaService } from "../../services/prisma/Prisma.service";
import { UserService } from "./User.service";

// import { JoinAsContributorResolver } from "./mutations/JoinAsContributor.resolver";
// import { GetAllContributorsResolver } from "./queries/GetAllContributors.resolver";

@Module({
  imports: [
    RedisModule,
    // HttpModule.register({
    //   timeout: 60000,
    //   maxRedirects: 10,
    // }),
  ],
  providers: [
    // JoinAsContributorResolver,
    // GetAllContributorsResolver,
    UserService,
    PrismaService,
  ],
  exports: [],
})
export class ContributorModule {}
