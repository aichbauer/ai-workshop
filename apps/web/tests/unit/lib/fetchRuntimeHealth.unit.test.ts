import { describe, expect, it, vi } from "vitest";

vi.mock("../../../lib/runtimeHealth/apiHealth", () => ({
  checkApiHealth: vi.fn(),
}));

import { checkApiHealth } from "../../../lib/runtimeHealth/apiHealth";
import { fetchRuntimeHealth } from "../../../lib/fetchRuntimeHealth";

describe("fetchRuntimeHealth lib", () => {
  it("composes api health into report", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-05T00:00:00.000Z"));

    vi.mocked(checkApiHealth).mockResolvedValue({
      key: "api",
      status: "healthy",
      endpoint: "http://api",
      probe: "http",
      latencyMs: 1,
      detail: "ok",
    });

    const report = await fetchRuntimeHealth();

    expect(report.checkedAt).toBe("2026-03-05T00:00:00.000Z");
    expect(report.services.map((service) => service.key)).toEqual(["api"]);
  });
});
