import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { RedisModule } from '../../core/resources/Redis/Redis.module';

// import { GetAllProjectsResolver } from './queries/GetAllProjects.resolver';
import { CreateProjectResolver } from './mutations/CreateProject.resolver';
// import { GetProjectByIdResolver } from './queries/GetProjectById.resolver';

@Module({
  imports: [
    RedisModule,
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 10,
    }),
  ],
  providers: [
    // GetAllProjectsResolver,
    // GetProjectByIdResolver,
    CreateProjectResolver,
  ],
  exports: [],
})
export class ProjectModule {}
