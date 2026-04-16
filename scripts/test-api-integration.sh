#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  pnpm test:api:int:db:down >/dev/null 2>&1 || true
}

trap cleanup EXIT

pnpm test:api:int:db:up
dotenv -e .env.test -- pnpm --filter api test:integration
