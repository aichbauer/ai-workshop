---
name: backend-developer
description: Builds and maintains the API in apps/api with Fastify 5+, Prisma 7+, PostgreSQL, and TypeScript 5+. Understands the current public-only backend shape, response envelopes, route registration, database setup, and dead-code cleanup expectations.
---

# Backend Developer

Use this skill when an OpenAI/Codex agent is changing the API in `apps/api`.

This skill covers the API in `apps/api`: Fastify 5+, Prisma 7+, PostgreSQL, TypeScript 5+, Node 24+, pnpm 10+. The current repo is intentionally minimal and public-only, so changes should preserve that simplicity unless the task explicitly expands the backend surface.

## Current shape

- `src/app.ts` builds the Fastify app, registers CORS, the root info route, and public routers.
- `src/routers/health.router.ts` exposes `GET /v1/internal/public/health`.
- `src/lib/apiResponse.ts` owns the success/error envelope helpers.
- `src/lib/prisma.ts` exposes the shared Prisma client singleton.
- `prisma/schema.prisma` is currently empty on purpose, and the first migration is an empty baseline.
- There is no auth layer and no private router in the current baseline.

## When to use

- Adding or refactoring public API routes or Fastify plugins.
- Updating response contracts, status handling, route registration, or Prisma setup.
- Keeping backend code small, typed, and free of unused helpers.

## Agent expectations

- Explore the existing API files before editing.
- Prefer direct implementation over speculative scaffolding.
- Keep the public API behavior stable unless the task explicitly changes it.
- Sweep touched backend files for dead imports, dead exports, stale scripts, and stale infra wiring before finishing.

## API response contract

- Successful statuses are limited to `200`, `201`, `202`, `204`.
- Client error statuses are limited to `400`, `401`, `402`, `403`, `404`, `405`, `409`, `429`.
- Server error status is limited to `500`.
- Successful responses use:
  - `{ kind: string, totalItems: number, itemsLength: number, items: unknown[] }`
- Error responses use:
  - `{ errors: Array<{ code: string; message: string }> }`

## Conventions

- Keep folders and files `camelCase`.
- Keep backend source files under 200 lines.
- Prefer small focused routers/helpers over speculative abstractions.
- Keep Prisma schema and migrations in sync with generated client artifacts.
- Remove unused helpers, routes, package dependencies, and deployment wiring in the same change.

## Workflow

1. Read the relevant `apps/api/src` files first.
2. Keep public route registration in routers, shared envelopes in `lib/apiResponse.ts`, and DB access behind `lib/prisma.ts` or feature-specific repositories when models are added.
3. Add or update tests first when the change is non-trivial.
4. When the schema changes, run `pnpm --filter api prisma:generate` and add the migration.
5. Run relevant tests and `pnpm --filter api run typecheck:unused` before finishing.
