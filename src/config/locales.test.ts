import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  isLocale,
  locales,
  localizedPath,
} from "./locales";

describe("locale configuration", () => {
  it("supports Portuguese, French and English with Portuguese as default", () => {
    expect(locales).toEqual(["pt", "fr", "en"]);
    expect(defaultLocale).toBe("pt");
  });

  it("validates locale values and creates localized paths", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(localizedPath("en", "/projectos")).toBe("/en/projectos");
    expect(localizedPath("pt", "/")).toBe("/pt");
  });
});

