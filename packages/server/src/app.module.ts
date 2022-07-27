import { Module } from "@nestjs/common";
// import { disconnect } from './core/utils/helpers/shutdown';
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { GraphQLModule } from "@nestjs/graphql";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule, ConfigService } from "@nestjs/config";
import publishedModel from "@discovery-dao/schemas/lib/model.json";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApolloComplexityPlugin } from "./core/utils/security/ApolloComplexity.plugin";
import { pubSub } from "./core/resources/Redis/redis";
import { HealthController } from "./core/controllers/health.controller";
import config from "./core/configs/config";

import { GraphqlConfig } from "./core/configs/config.interface";
import { ProjectModule } from "./entities/Projects/Project.module";
import { PathwayModule } from "./entities/Pathways/Pathway.module";
import { QuestModule } from "./entities/Quests/Quest.module";
import { TagModule } from "./entities/Tags/Tag.module";
import { GetAppDIDResolver } from "./entities/App/queries/GetAppDID.resolver";
import { PrismaService } from "./services/prisma/Prisma.service";
import { UserModule } from "./entities/Users/User.module";
import { CeramicService } from "./services/ceramic/Ceramic.service";
import { CERAMIC_TESTNET_NODE_URL } from "./core/constants/ceramic";

// https://jaywolfe.dev/how-to-use-es-modules-with-older-node-js-projects-the-right-way/
const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>("graphql");
        return {
          cors: false,
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            numberScalarMode: "integer",
            pubSub,
          },
          plugins: [new ApolloComplexityPlugin(80)],
          formatError: (error) => error.toJSON(),
          sortSchema: graphqlConfig?.sortSchema,
          autoSchemaFile:
            graphqlConfig?.schemaDestination || "./src/schema.graphql",
          debug: graphqlConfig?.debug,
          playground: graphqlConfig?.playgroundEnabled,
          context: ({ req, res }) => ({ req, res }),
        };
      },
      inject: [ConfigService],
    }),
    TerminusModule,
    ProjectModule,
    PathwayModule,
    QuestModule,
    TagModule,
    UserModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    ConfigService,
    GetAppDIDResolver,
    PrismaService,
    {
      provide: CeramicService,
      async useFactory() {
        return new CeramicService(
          new (
            await dynamicImport("@ceramicnetwork/http-client")
          ).CeramicClient(CERAMIC_TESTNET_NODE_URL),
          new (await dynamicImport("@self.id/core")).Core({
            ceramic: CERAMIC_TESTNET_NODE_URL,
            aliases: publishedModel,
          }),
          await dynamicImport("@glazed/datamodel"),
          await dynamicImport("@glazed/did-datastore")
        );
      },
    },
  ],
})
export class AppModule {}

// TODO: fix port already in use on hot reload
// export class AppModule implements OnApplicationShutdown {
//   async beforeApplicationShutdown(signal: string) {
//     Logger.log('before shutdown', signal); // e.g. "SIGINT"
//     await disconnect();
//     return new Promise((resolve) => {
//       setTimeout(resolve, 3000);
//     });
//   }
//   onApplicationShutdown(signal: string) {
//     Logger.log('shutting down', signal); // e.g. "SIGINT"
//     return;
//   }
// }
