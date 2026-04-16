import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const configDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "server-only": path.join(configDir, "tests/unit/support/serverOnlyStub.ts"),
    },
  },
  test: {
    include: ["tests/unit/**/*.unit.test.ts"],
    setupFiles: ["tests/unit/setup.ts"],
    environment: "node",
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
