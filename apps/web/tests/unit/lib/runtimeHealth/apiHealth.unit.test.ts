import { describe, expect, it, vi } from "vitest";
import { checkApiHealth } from "../../../../lib/runtimeHealth/apiHealth";

describe("runtimeHealth apiHealth lib", () => {
  it("returns healthy when endpoint replies status=ok", async () => {
    vi.spyOn(Date, "now").mockReturnValueOnce(1_000).mockReturnValueOnce(1_025);
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ kind: "ok", totalItems: 1, itemsLength: 1, items: [{ status: "ok" }] }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    const service = await checkApiHealth();
    expect(service.status).toBe("healthy");
    expect(service.latencyMs).toBe(25);
    expect(service.detail).toContain("status=ok");
  });

  it("returns degraded for unexpected payload status", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ kind: "ok", totalItems: 1, itemsLength: 1, items: [{ status: "slow" }] }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    const service = await checkApiHealth();
    expect(service.status).toBe("degraded");
    expect(service.detail).toContain("Unexpected status: slow");
  });

  it("maps non-ok HTTP and request failures to unreachable", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockRejectedValueOnce(new Error("network down"));

    const httpFailure = await checkApiHealth();
    const thrownFailure = await checkApiHealth();

    expect(httpFailure.status).toBe("unreachable");
    expect(httpFailure.detail).toBe("HTTP 503");
    expect(thrownFailure.status).toBe("unreachable");
    expect(thrownFailure.detail).toBe("network down");
  });
});
