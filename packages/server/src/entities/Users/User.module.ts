import { Module } from "@nestjs/common";

import { RedisModule } from "../../core/resources/Redis/Redis.module";
import { PrismaService } from "../../services/prisma/Prisma.service";
import { SignInResolver } from "./mutations/SignIn.resolver";
import { SignOutResolver } from "./mutations/SignOut.resolver";
import { GetNonceResolver } from "./queries/GetNonce.resolver";
import { MeResolver } from "./queries/Me.resolver";
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
    GetNonceResolver,
    MeResolver,
    SignInResolver,
    SignOutResolver,
    UserService,
    PrismaService,
  ],
  exports: [],
})
export class UserModule {}
