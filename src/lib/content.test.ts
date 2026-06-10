import { describe, expect, it } from "vitest";

import { getLocalizedText } from "./content";

describe("localized content fallback", () => {
  const text = {
    pt: "Porto de Bissau",
    fr: "Port de Bissau",
  };

  it("returns the requested translation when it exists", () => {
    expect(getLocalizedText(text, "fr")).toBe("Port de Bissau");
  });

  it("falls back to Portuguese while automatic translation is pending", () => {
    expect(getLocalizedText(text, "en")).toBe("Porto de Bissau");
  });
});

