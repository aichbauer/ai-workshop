---
name: frontend-developer
description: Build, refactor, and debug the web frontend in apps/web with Next.js, React, TypeScript, Tailwind, and locale-aware public pages.
---

# Frontend Developer

Use this skill when an OpenAI/Codex agent is changing the web app in `apps/web`.

This skill covers the frontend in `apps/web`: Next.js 16 app router, React 19, TypeScript 5, Tailwind 4, and locale-aware public pages. The current repo is intentionally small, so prefer simple route files and utility modules over large abstraction layers.

## Current shape

- `/` redirects to the resolved locale.
- `/{locale}` is the main public page.
- Locale support is limited to `en` and `de`.
- Health fetching lives in `lib/` and is rendered by a small app-router page.
- The baseline should stay free of unused routes, providers, hooks, and component trees.

## When to use

- Implementing or refactoring pages in `apps/web/app`
- Updating locale resolution, API helpers, or runtime-health display
- Simplifying frontend structure and deleting dead code

## Agent expectations

- Read the route files and `lib/` helpers before editing.
- Prefer the smallest server-rendered solution that satisfies the task.
- Keep localized public routing working for `en` and `de`.
- Sweep touched frontend files for dead imports, dead helpers, unused tests, and stale route assets before finishing.

## Conventions

1. Read the existing route files and `lib/` helpers before changing structure.
2. Keep `.ts` and `.tsx` files under 200 lines; split only when a file stops being easy to scan.
3. Prefer server-rendered route files and simple utility functions when they are enough.
4. Keep all user-facing strings in `apps/web/messages/en.json` and `apps/web/messages/de.json`.
5. Remove unused routes, components, helpers, tests, assets, and dependencies in the same change.

## Styling

- Use Tailwind utilities directly in route files when the UI is small.
- Preserve a clear visual direction; avoid placeholder starter-kit styling.
- Keep globals limited to app-wide resets and typography.

## Testing

- Use Red-Green-Refactor for non-trivial logic.
- Add or update unit tests for locale helpers, API helpers, and runtime-health logic.
- Mock only external boundaries such as `fetch`, `next/headers`, or timers.

## Example

```tsx
import { notFound } from "next/navigation";
import { fetchRuntimeHealth } from "../../lib/fetchRuntimeHealth";
import { isLocale } from "../../lib/routing";

export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const report = await fetchRuntimeHealth();
  return <pre>{JSON.stringify(report, null, 2)}</pre>;
}
```
