import { Module } from "@nestjs/common";

import { RedisModule } from "../../core/resources/Redis/Redis.module";

import { GetAllProjectsResolver } from "./queries/GetAllProjects.resolver";
import { CreateProjectResolver } from "./mutations/CreateProject.resolver";
import { GetProjectByIdResolver } from "./queries/GetProjectById.resolver";
import { AppService } from "../../app.service";
import { ApproveProjectResolver } from "./mutations/ApproveProject.resolver";
import { EditProjectResolver } from "./mutations/EditProject.resolver";
import { CeramicProjectService } from "./CeramicProject.service";

import { ProjectService } from "./Project.service";
import { PrismaService } from "../../services/prisma/Prisma.service";

@Module({
  imports: [RedisModule],
  providers: [
    GetAllProjectsResolver,
    GetProjectByIdResolver,
    CreateProjectResolver,
    EditProjectResolver,
    ApproveProjectResolver,
    AppService,
    CeramicProjectService,
    ProjectService,
    PrismaService,
  ],
  exports: [],
})
export class ProjectModule {}
