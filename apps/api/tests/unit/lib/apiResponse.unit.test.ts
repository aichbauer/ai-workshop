import { describe, expect, it, vi } from "vitest";
import {
  createErrorResponse,
  createSuccessResponse,
  sendError,
  sendSuccess,
} from "../../../src/lib/apiResponse.js";

function createReplyState() {
  const state: { statusCode?: number; payload?: unknown } = {};
  const reply = {
    status: vi.fn((code: number) => {
      state.statusCode = code;
      return reply;
    }),
    send: vi.fn((payload: unknown) => {
      state.payload = payload;
      return payload;
    }),
  };
  return { state, reply };
}

describe("apiResponse lib", () => {
  it("creates success envelope with normalized single item", () => {
    const payload = createSuccessResponse("resources", { cuid: "c-1" });
    expect(payload).toEqual({
      kind: "resources",
      totalItems: 1,
      itemsLength: 1,
      items: [{ cuid: "c-1" }],
    });
  });

  it("creates success envelope with explicit totalItems", () => {
    const payload = createSuccessResponse("resources", [{ cuid: "p-1" }], 42);
    expect(payload).toEqual({
      kind: "resources",
      totalItems: 42,
      itemsLength: 1,
      items: [{ cuid: "p-1" }],
    });
  });

  it("creates error envelope with normalized array", () => {
    expect(createErrorResponse({ code: "NOT_FOUND", message: "Missing" })).toEqual({
      errors: [{ code: "NOT_FOUND", message: "Missing" }],
    });
  });

  it("sends success with reply status + envelope", () => {
    const { reply, state } = createReplyState();
    sendSuccess(reply as never, {
      status: 201,
      kind: "resources",
      items: { cuid: "c-1" },
    });
    expect(state.statusCode).toBe(201);
    expect(state.payload).toEqual({
      kind: "resources",
      totalItems: 1,
      itemsLength: 1,
      items: [{ cuid: "c-1" }],
    });
  });

  it("sends error with reply status + envelope", () => {
    const { reply, state } = createReplyState();
    sendError(reply as never, 404, { code: "NOT_FOUND", message: "Missing" });
    expect(state.statusCode).toBe(404);
    expect(state.payload).toEqual({
      errors: [{ code: "NOT_FOUND", message: "Missing" }],
    });
  });
});
