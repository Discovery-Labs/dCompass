import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MeResolver } from './queries/Me.resolver';
import { GetUserByIdResolver } from './queries/GetUserById.resolver';
import { ConfirmationTokenStatusResolver } from './queries/ConfirmationTokenStatus.resolver';

import { RedisModule } from '../../core/resources/Redis/Redis.module';

import { UserService } from './User.service';

@Module({
  imports: [
    RedisModule,
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 10,
    }),
  ],
  providers: [
    UserService,
    MeResolver,
    GetUserByIdResolver,
    ConfirmationTokenStatusResolver,
  ],
  exports: [UserService],
})
export class UserModule {}
