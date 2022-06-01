import { Module } from "@nestjs/common";

import { RedisModule } from "../../core/resources/Redis/Redis.module";

import { CreatePathwayResolver } from "./mutations/CreatePathway.resolver";
import { GetAllPathwaysByProjectIdResolver } from "./queries/GetAllPathwaysByProjectId.resolver";
import { ApprovePathwayResolver } from "./mutations/ApprovePathway.resolver";
import { GetPathwayByIdResolver } from "./queries/GetPathwayById.resolver";
import { AppService } from "../../app.service";
import { VerifyPathwayResolver } from "./mutations/VerifyPathway.resolver";

import { ClaimPathwayRewardsResolver } from "./mutations/ClaimPathwayRewards.resolver";
import { PrismaService } from "../../services/prisma/Prisma.service";
import { ProjectService } from "../Projects/Project.service";
import { PathwayService } from "./Pathway.service";
import { EditPathwayResolver } from "./mutations/EditPathway.resolver";

@Module({
  imports: [RedisModule],
  providers: [
    CreatePathwayResolver,
    ApprovePathwayResolver,
    GetPathwayByIdResolver,
    EditPathwayResolver,
    GetAllPathwaysByProjectIdResolver,
    VerifyPathwayResolver,
    ClaimPathwayRewardsResolver,
    AppService,
    ProjectService,
    PathwayService,
    PrismaService,
  ],
  exports: [],
})
export class PathwayModule {}
