import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, supportedLocales } from "../../../lib/routing";

describe("routing lib", () => {
  it("exposes supported locale defaults", () => {
    expect(supportedLocales).toEqual(["en", "de"]);
    expect(defaultLocale).toBe("en");
  });

  it("validates locale values", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
});
