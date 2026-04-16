import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

import { headers } from "next/headers";
import { getLocale } from "../../../lib/getLocale";

const headersMock = vi.mocked(headers);

describe("getLocale lib", () => {
  it("prefers locale from pathname prefix", async () => {
    headersMock.mockResolvedValue(
      new Headers({
        "x-pathname": "/de/resources",
        cookie: "NEXT_LOCALE=en",
        "accept-language": "en-US,en;q=0.9",
      })
    );

    await expect(getLocale()).resolves.toBe("de");
  });

  it("falls back from cookie to accept-language to default", async () => {
    headersMock.mockResolvedValueOnce(new Headers({ cookie: "NEXT_LOCALE=de" }));
    await expect(getLocale()).resolves.toBe("de");

    headersMock.mockResolvedValueOnce(
      new Headers({ "accept-language": "fr-FR, de-DE;q=0.8" })
    );
    await expect(getLocale()).resolves.toBe("de");

    headersMock.mockResolvedValueOnce(new Headers());
    await expect(getLocale()).resolves.toBe("en");
  });
});
