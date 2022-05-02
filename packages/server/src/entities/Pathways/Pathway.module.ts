import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { RedisModule } from "../../core/resources/Redis/Redis.module";

import { CreatePathwayResolver } from "./mutations/CreatePathway.resolver";
import { GetAllPathwaysByProjectIdResolver } from "./queries/GetAllPathwaysByProjectId.resolver";
import { ApprovePathwayResolver } from "./mutations/ApprovePathway.resolver";
import { GetPathwayByIdResolver } from "./queries/GetPathwayById.resolver";
import { AppService } from "../../app.service";
import { VerifyPathwayResolver } from "./mutations/VerifyPathway.resolver";
import { ThreadDBService } from "../../services/thread-db/thread-db.service";
import { ClaimPathwayRewardsResolver } from "./mutations/ClaimPathwayRewards.resolver";
import { PrismaService } from "../../services/prisma/Prisma.service";
import { ProjectService } from "../Projects/Project.service";
import { PathwayService } from "./Pathway.service";

@Module({
  imports: [
    RedisModule,
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 10,
    }),
  ],
  providers: [
    CreatePathwayResolver,
    ApprovePathwayResolver,
    GetPathwayByIdResolver,
    GetAllPathwaysByProjectIdResolver,
    VerifyPathwayResolver,
    ClaimPathwayRewardsResolver,
    AppService,
    ThreadDBService,
    ProjectService,
    PathwayService,
    PrismaService,
  ],
  exports: [],
})
export class PathwayModule {}
