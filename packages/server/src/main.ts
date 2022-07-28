import { config as dotenvConfig } from "dotenv";
dotenvConfig();
// import cookieParser from 'cookie-parser';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
// import { sessionMiddleware } from './core/resources/Redis/redis';
// import { Context } from "./core/utils/types";
// import { NextFunction } from "express";
// import {
//   ceramicCoreFactory,
//   ceramicDataModelFactory,
// } from "./services/ceramic/data-models";

import { Logger, ValidationPipe } from "@nestjs/common";
import config from "./core/configs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { SwaggerConfig } from "./core/configs/config.interface";

import { sessionMiddleware } from "./core/resources/Redis/redis";
import cookieParser from "cookie-parser";
import { CeramicService } from "./services/ceramic/Ceramic.service";
import { Context } from "./core/utils/types";
import { NextFunction } from "express";
// import { PrismaService } from "./services/prisma/Prisma.service";

const {
  api: { protocol, hostname, port, corsOptions },
  sessionOptions,
} = config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    cors: corsOptions,
  });

  app.disable("x-powered-by");

  // if we add cloudflare on a proxy
  app.set("trust proxy", 1); // trust first proxy

  // enable shutdown hooks
  // const prismaService = app.get(PrismaService);
  // await prismaService.enableShutdownHooks(app);
  app.enableShutdownHooks(["SIGINT", "SIGTERM"]);
  app.use(cookieParser(sessionOptions.secret));
  app.use(sessionMiddleware);

  const ceramicService = app.get(CeramicService);
  // const ceramicClient = await ceramicDataModelFactory();

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
      req.ceramicClient = await ceramicService.ceramicDataModelFactory();

      req.ceramicCore = ceramicService.getCore();
      next();
    }
  );

  const configService = app.get(ConfigService);
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

  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: false,
        value: true,
      },
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(port, () => {
    Logger.log(`${protocol()}://${hostname}/health`, "REST API");
    Logger.log(`${protocol()}://${hostname}/graphql`, "GraphQL API");
  });
}
bootstrap();
