import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../../../src/app.js";

describe("health integration", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp({ logger: false });
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns API health status", async () => {
    // Arrange
    const request = {
      method: "GET" as const,
      url: "/v1/internal/public/health",
    };

    // Act
    const response = await app.inject({
      method: request.method,
      url: request.url,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      kind: "healthChecks",
      totalItems: 1,
      itemsLength: 1,
      items: [{ status: "ok", service: "api" }],
    });
  });

  it("returns not found on unknown public endpoint", async () => {
    // Arrange
    const request = {
      method: "GET" as const,
      url: "/v1/internal/public/health/unknown",
    };

    // Act
    const response = await app.inject({
      method: request.method,
      url: request.url,
    });

    // Assert
    expect(response.statusCode).toBe(404);
  });
});
