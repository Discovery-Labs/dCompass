## Prisma Setup

### 1. Install Dependencies

Install [Nestjs CLI](https://docs.nestjs.com/cli/usages) to start and [generate CRUD resources](https://trilon.io/blog/introducing-cli-generators-crud-api-in-1-minute)

```bash
yarn global add @nestjs/cli
```

Install the dependencies for the Nest application:

```bash
yarn install
```

### 2. PostgreSQL with Docker

Setup a development PostgreSQL with Docker. Copy [.env.example](./.env.example) and rename to `.env` - `cp .env.example .env` - which sets the required environments for PostgreSQL such as `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB`. Update the variables as you wish and select a strong password.

Start the PostgreSQL database

```bash
docker-compose -f docker-compose.db.yml up -d
# or
yarn docker:db
```

### 3. Prisma Migrate

[Prisma Migrate](https://github.com/prisma/prisma2/tree/master/docs/prisma-migrate) is used to manage the schema and migration of the database. Prisma datasource requires an environment variable `DATABASE_URL` for the connection to the PostgreSQL database. Prisma reads the `DATABASE_URL` from the root [.env](./.env) file.

Use Prisma Migrate in your [development environment](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#evolving-the-schema-in-development) to

1. Creates `migration.sql` file
2. Updates Database Schema
3. Generates Prisma Client

```bash
npx prisma migrate dev
# or
yarn migrate:dev
```

If you like to customize your `migration.sql` file run the following command. After making your customizations run `npx prisma migrate dev` to apply it.

```bash
npx prisma migrate dev --create-only
# or
yarn migrate:dev:create
```

If you are happy with your database changes you want to deploy those changes to your [production database](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#applying-migrations-in-production-and-other-environments). Use `prisma migrate deploy` to apply all pending migrations, can also be used in CI/CD pipelines as it works without prompts.

```bash
npx prisma migrate deploy
# or
yarn migrate:deploy
```

### 4. Prisma: Prisma Client JS

[Prisma Client JS](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/api) is a type-safe database client auto-generated based on the data model.

Generate Prisma Client JS by running

> **Note**: Every time you update [schema.prisma](prisma/schema.prisma) re-generate Prisma Client JS

```bash
npx prisma generate
# or
yarn prisma:generate
```

### 5. Seed the database data with this script

Execute the script with this command:

```bash
yarn seed
```

### 6. Start NestJS Server

Run Nest Server in Development mode:

```bash
yarn start

# watch mode
yarn start:dev
```

Run Nest Server in Production mode:

```bash
yarn start:prod
```

> GraphQL Playground for the NestJS Server is available here: http://localhost:5000/graphql
