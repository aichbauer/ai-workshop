FROM node:24-bookworm-slim AS base

WORKDIR /app

ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

FROM base AS deps-prod

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --filter web --prod --frozen-lockfile

FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --filter web --frozen-lockfile

COPY apps/web apps/web

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_ORIGIN

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_APP_ORIGIN=${NEXT_PUBLIC_APP_ORIGIN}

RUN pnpm --filter web build

FROM gcr.io/distroless/nodejs24-debian12:nonroot AS runner

WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV WEB_PORT=15987
ENV PORT=15987
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps-prod /app/node_modules /app/node_modules
COPY --from=deps-prod /app/apps/web/node_modules /app/apps/web/node_modules
COPY --from=builder /app/apps/web/.next /app/apps/web/.next
COPY --from=builder /app/apps/web/public /app/apps/web/public
COPY --from=builder /app/apps/web/messages /app/apps/web/messages
COPY --from=builder /app/apps/web/next.config.mjs /app/apps/web/next.config.mjs
COPY --from=builder /app/apps/web/package.json /app/apps/web/package.json

EXPOSE 15987

CMD ["/app/apps/web/node_modules/next/dist/bin/next", "start"]
