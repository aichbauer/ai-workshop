FROM node:24-bookworm-slim AS base

WORKDIR /app

ENV CI=true

RUN corepack enable

FROM base AS deps-prod

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/prisma apps/api/prisma

RUN pnpm install --filter api --prod --frozen-lockfile
RUN PRISMA_ALLOW_PLACEHOLDER_URL=1 pnpm --dir apps/api prisma:generate

FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --filter api --frozen-lockfile

COPY apps/api apps/api

RUN PRISMA_ALLOW_PLACEHOLDER_URL=1 pnpm --dir apps/api prisma:generate
RUN pnpm --filter api build

FROM gcr.io/distroless/nodejs24-debian12:nonroot AS runner

WORKDIR /app/apps/api

ENV NODE_ENV=production
ENV PORT=15988

COPY --from=deps-prod /app/node_modules /app/node_modules
COPY --from=deps-prod /app/apps/api/node_modules /app/apps/api/node_modules
COPY --from=builder /app/apps/api/dist /app/apps/api/dist
COPY --from=builder /app/apps/api/package.json /app/apps/api/package.json
COPY --from=builder /app/apps/api/prisma /app/apps/api/prisma

EXPOSE 15988

CMD ["dist/server.js"]
