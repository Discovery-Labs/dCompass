import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { RedisModule } from '../../core/resources/Redis/Redis.module';

import { CreateBadgeResolver } from './mutations/CreateBadge.resolver';
import { GetAllBadgesByProjectIdResolver } from './queries/GetAllBadgesByProjectId.resolver';
import { ApproveBadgeResolver } from './mutations/ApproveBadge.resolver';
import { GetBadgeByIdResolver } from './queries/GetBadgeById.resolver';

@Module({
  imports: [
    RedisModule,
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 10,
    }),
  ],
  providers: [
    CreateBadgeResolver,
    ApproveBadgeResolver,
    GetBadgeByIdResolver,
    GetAllBadgesByProjectIdResolver,
  ],
  exports: [],
})
export class BadgeModule {}
