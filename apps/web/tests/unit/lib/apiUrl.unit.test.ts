import { describe, expect, it, vi } from "vitest";
import { apiUrl } from "../../../lib/apiUrl";

describe("apiUrl lib", () => {
  it("uses internal base for server development internal scopes", () => {
    vi.stubEnv("NODE_ENV", "development");
    process.env.API_INTERNAL_URL = "http://internal:9999";
    process.env.NEXT_PUBLIC_API_URL = "http://public:8888";

    expect(apiUrl("/health", "internal-public")).toBe(
      "http://internal:9999/v1/internal/public/health"
    );
    expect(apiUrl("health")).toBe("http://public:8888/v1/external/public/health");
  });

  it("uses public base for browser and non-dev server", () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    (globalThis as { window?: unknown }).window = {};

    expect(apiUrl("health", "internal-public")).toBe(
      "https://api.example.com/v1/internal/public/health"
    );
    expect(apiUrl("health", "external-public")).toBe(
      "https://api.example.com/v1/external/public/health"
    );
  });
});
