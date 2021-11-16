import { Module } from '@nestjs/common';
// import { disconnect } from './core/utils/helpers/shutdown';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { TerminusModule } from '@nestjs/terminus';
import depthLimit from 'graphql-depth-limit';
import { formatError } from 'graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloComplexityPlugin } from './core/utils/security/ApolloComplexity.plugin';
import { pubSub } from './core/resources/Redis/redis';
import { HealthController } from './core/controllers/health.controller';
import config from './core/configs/config';
import { GraphqlConfig } from './core/configs/config.interface';
import { UserModule } from './entities/User/User.module';
import { ProjectModule } from './entities/Projects/Project.module';
// import { KnowsisController } from './core/controllers/knowsis.controller';
// import { DefinitionsController } from './core/controllers/definitions.controller';
// import { CourseModule } from './entities/Courses/Course.module';
// import { QuestModule } from './entities/Quests/Quest.module';
// import { TagModule } from './entities/Tags/Tag.module';
import { CeramicController } from './core/controllers/validate-quest-completion.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 10,
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          cors: false,
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
            pubSub,
          },
          plugins: [new ApolloComplexityPlugin(80)],
          formatError,
          validationRules: [depthLimit(10)],
          sortSchema: graphqlConfig?.sortSchema,
          autoSchemaFile:
            graphqlConfig?.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig?.debug,
          playground: graphqlConfig?.playgroundEnabled,
          context: ({ req, res }) => ({ req, res }),
        };
      },
      inject: [ConfigService],
    }),
    TerminusModule,
    UserModule,
    ProjectModule,
    // CourseModule,
    // QuestModule,
    // TagModule,
  ],
  controllers: [
    AppController,
    HealthController,
    // KnowsisController,
    // DefinitionsController,
    CeramicController,
  ],
  providers: [AppService, ConfigService],
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
