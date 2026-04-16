import { afterEach, describe, expect, it, vi } from "vitest";

const originalNodeEnv = process.env.NODE_ENV;

describe("prisma lib", () => {
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    delete (globalThis as typeof globalThis & { prisma?: unknown }).prisma;
    vi.resetModules();
  });

  it("reuses a singleton prisma client outside production", async () => {
    process.env.NODE_ENV = "development";

    const firstModule = await import("../../../src/lib/prisma.js");
    const secondModule = await import("../../../src/lib/prisma.js");

    expect(firstModule.prisma).toBe(secondModule.prisma);
    expect((globalThis as typeof globalThis & { prisma?: unknown }).prisma).toBe(
      firstModule.prisma
    );
  });

  it("does not store prisma on globalThis in production", async () => {
    process.env.NODE_ENV = "production";

    const module = await import("../../../src/lib/prisma.js");

    expect(module.prisma).toBeDefined();
    expect((globalThis as typeof globalThis & { prisma?: unknown }).prisma).toBeUndefined();
  });
}
