# AI Workshop Starter Kit

Minimal monorepo for an AI Workshop Starter Kit nodejs app with Nextjs, Fastify, Prisma, and PostgreSQL support:

- `apps/api`: Fastify 5 + TypeScript API with Prisma 7 + PostgreSQL support
- `apps/web`: Next.js 16 + React 19 frontend with localized `en`/`de` health pages
- `docker/`: Docker Compose fragments for running the API, Postgres, and web app

## API Surface

- `GET /` - generic API info
- `GET /v1/internal/public/health` - API health check

## Prerequisites

- Node.js `>=24`
- pnpm `10.30.2`
- Docker + Docker Compose v2

## Local Setup

1. Copy environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
corepack enable
pnpm install
```

3. Run apps locally:

```bash
pnpm dev
```

- API: `http://localhost:15988/v1/internal/public/health`
- Web: `http://localhost:15987`

## Docker Development

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Services:

- `app_database`
- `app_api_database_migrations`
- `app_api`
- `app_web`

## Tests

From repo root:

```bash
pnpm --filter api test:unit
pnpm --filter api test:integration
pnpm --filter web test:unit
```

Integration DB helpers:

```bash
pnpm test:api:int:db:up
pnpm test:api:int:db:down
```

## Prisma

Schema lives in `apps/api/prisma/schema.prisma`.

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate
```
