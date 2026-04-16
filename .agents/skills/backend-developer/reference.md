This file expands on [SKILL.md](SKILL.md) with a small public-route example and the restored Prisma/PostgreSQL baseline.

## Prisma baseline

- `prisma/schema.prisma` is intentionally empty right now.
- The first migration is an empty baseline and should stay that way until real models are added.
- `src/lib/prisma.ts` is the shared Prisma client entrypoint.
- When models are introduced:
  - update `schema.prisma`
  - create a real migration
  - run `pnpm --filter api prisma:generate`
  - add tests for the new data access path

## Example public router

```ts
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { sendSuccess } from "../lib/apiResponse.js";

export async function healthRouter(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.get("/health", async (_request, reply) => {
    return sendSuccess(reply, {
      status: 200,
      kind: "healthChecks",
      items: [{ status: "ok", service: "api" }],
      totalItems: 1,
    });
  });
}
```

## Example app registration

```ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { healthRouter } from "./routers/health.router.js";

export async function buildApp() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(healthRouter, { prefix: "/v1/internal/public" });
  return app;
}
```

## Example Prisma client entrypoint

```ts
import { PrismaClient } from "../generated/prisma/client.js";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

## Verification checklist

- Response envelopes use `sendSuccess` / `sendError`
- Public routes stay simple and typed
- Prisma schema, migrations, and generated client stay in sync
- Unused helpers and dependencies are removed in the same change
