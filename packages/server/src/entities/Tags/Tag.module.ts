import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { RedisModule } from '../../core/resources/Redis/Redis.module';

import { GetAllTagsResolver } from './queries/GetAllTags.resolver';
import { CreateTagResolver } from './mutations/CreateTag.resolver';
import { CreateTagsResolver } from './mutations/CreateTags.resolver';

@Module({
  imports: [
    RedisModule,
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 10,
    }),
  ],
  providers: [GetAllTagsResolver, CreateTagResolver, CreateTagsResolver],
  exports: [],
})
export class TagModule {}
