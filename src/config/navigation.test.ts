import { describe, expect, it } from "vitest";

import { primaryNavigation } from "./navigation";

describe("official APGB navigation", () => {
  it("keeps the six approved main menu entries in order", () => {
    expect(primaryNavigation.map((item) => item.label.pt)).toEqual([
      "Home",
      "Autoridade Portuária",
      "Porto de Bissau",
      "Área de Negócio Portuário",
      "Área Social",
      "Projectos",
    ]);
  });

  it("keeps secondary menu entries inside their approved main areas", () => {
    const authority = primaryNavigation[1];
    const business = primaryNavigation[3];

    expect(authority.children?.some((item) => item.slug === "quem-somos")).toBe(
      true,
    );
    expect(
      business.children?.some(
        (item) => item.slug === "regulamentos-e-tarifarios",
      ),
    ).toBe(true);
  });
});

