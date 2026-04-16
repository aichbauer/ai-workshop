import { describe, expect, it } from "vitest";
import {
  buildApiRequestError,
  parseApiSuccessEnvelope,
  requireSingleItem,
} from "../../../lib/apiEnvelope";

describe("apiEnvelope lib", () => {
  it("parses success envelope json", async () => {
    const response = new Response(
      JSON.stringify({ kind: "ok", totalItems: 1, itemsLength: 1, items: [{ id: "1" }] }),
      { status: 200, headers: { "content-type": "application/json" } }
    );

    const envelope = await parseApiSuccessEnvelope<{ id: string }>(response);
    expect(envelope.items[0]?.id).toBe("1");
  });

  it("builds request error from first API error", async () => {
    const response = new Response(
      JSON.stringify({ errors: [{ code: "INVALID", message: "Bad input" }] }),
      { status: 422, headers: { "content-type": "application/json" } }
    );

    const error = await buildApiRequestError(response);
    expect(error.message).toBe("Bad input");
    expect(error.code).toBe("INVALID");
    expect(error.status).toBe(422);
  });

  it("falls back to status message when error payload is unavailable", async () => {
    const response = new Response("not-json", {
      status: 500,
      headers: { "content-type": "application/json" },
    });

    const error = await buildApiRequestError(response);
    expect(error.message).toBe("Request failed with status 500");
    expect(error.code).toBeUndefined();
  });

  it("returns first item or throws fallback message", () => {
    expect(
      requireSingleItem({ kind: "ok", totalItems: 1, itemsLength: 1, items: [{ id: "x" }] }, "missing")
    ).toEqual({ id: "x" });

    expect(() =>
      requireSingleItem({ kind: "ok", totalItems: 0, itemsLength: 0, items: [] }, "missing")
    ).toThrow("missing");
  });
});
