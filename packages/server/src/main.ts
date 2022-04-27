import { config as dotenvConfig } from "dotenv";
dotenvConfig();
// import cookieParser from 'cookie-parser';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
// import { sessionMiddleware } from './core/resources/Redis/redis';
import { Context } from "./core/utils/types";
import { ThreadID } from "@textile/hub";
import { NextFunction } from "express";
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";
import config from "./core/configs/config";
// import { makeCeramicClient } from './services/ceramic/ceramic.service';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { CorsConfig, SwaggerConfig } from "./core/configs/config.interface";
import {
  ceramicCoreFactory,
  ceramicDataModelFactory,
} from "./services/ceramic/data-models";
import { getDBClient } from "./core/resources/ThreadDB/thread-db";
import { PrismaService } from "./services/prisma/Prisma.service";

const {
  api: { protocol, hostname, port, corsOptions },
} = config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  app.enableCors(corsOptions);
  app.disable("x-powered-by");

  // if we add cloudflare on a proxy
  // app.set('trust proxy', 1); // trust first proxy

  // enable shutdown hooks
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.enableShutdownHooks(["SIGINT", "SIGTERM"]);

  const ceramicClient = await ceramicDataModelFactory();

  // app.use(cookieParser(sessionOptions.secret));
  // app.use(sessionMiddleware);
  /* Cookie & Session cleaner */
  // app.use((req: Context['req'], res: Context['res'], next: NextFunction) => {
  //   if (req.cookies[sessionOptions.name] && !req.session?.userId) {
  //     res.clearCookie(sessionOptions.name);
  //   }
  //   next();
  // });

  app.use(
    async (req: Context["req"], _res: Context["res"], next: NextFunction) => {
      const dbClient = await getDBClient();
      const appThreads = await dbClient.listThreads();
      const latestThreadId = ThreadID.fromString(
        appThreads[appThreads.length - 1].id
      );
      const ceramicCore = ceramicCoreFactory();
      req.ceramicClient = ceramicClient;
      req.dbClient = dbClient;
      req.latestThreadId = latestThreadId;
      req.ceramicCore = ceramicCore;
      next();
    }
  );

  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfig>("cors");
  const swaggerConfig = configService.get<SwaggerConfig>("swagger");

  // Swagger Api
  if (swaggerConfig?.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || "Nestjs")
      .setDescription(swaggerConfig.description || "The nestjs API description")
      .setVersion(swaggerConfig.version || "1.0")
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || "api", app, document);
  }

  // Cors
  if (corsConfig?.enabled) {
    app.enableCors();
  }

  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: false,
        value: true,
      },
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException(errors),
      forbidNonWhitelisted: true,
    })
  );
  await app.listen(port, () => {
    Logger.log(`${protocol()}://${hostname}/health`, "REST API");
    Logger.log(`${protocol()}://${hostname}/graphql`, "GraphQL API");
  });
}
bootstrap();
