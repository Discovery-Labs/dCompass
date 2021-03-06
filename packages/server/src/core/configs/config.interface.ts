import { RedisOptions } from "ioredis";

export interface Config {
  nest: NestConfig;
  ceramic: CeramicConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  infuraKey: string;
  api: {
    tracing: boolean;
    apiKey: string;
    environment: string;
    hostname: string;
    confirmationTokenExpiration: number;
    port: number;
    logLevel: string;
    protocol: any;
    corsOptions: {
      credentials: boolean;
      origin: (origin: any, callback: any) => void;
    };
    rateLimits?: {
      register: number;
    };
  };
  apolloServerOptions: {
    tracing: boolean;
    introspection: boolean;
    playground: boolean;
  };
  app: {
    url: string;
  };
  redisConfig: RedisOptions;
  redisAuthConfig: RedisOptions;
  sessionOptions: {
    name: string;
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;

    cookie: {
      secure: boolean;
      httpOnly: boolean;
      sameSite: boolean | "lax" | "strict" | "none";
      path: string;
      domain?: string;
      maxAge: number;
    };
  };
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface CeramicConfig {
  apiUrl: string;
  seed: string;
  forceSync: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}
