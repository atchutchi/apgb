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
    const social = primaryNavigation[4];
    const projects = primaryNavigation[5];

    expect(authority.children?.some((item) => item.slug === "quem-somos")).toBe(
      true,
    );
    expect(authority.children?.some((item) => item.slug === "estatistica")).toBe(
      true,
    );
    expect(
      business.children?.some(
        (item) => item.slug === "regulamentos-e-tarifarios",
      ),
    ).toBe(true);
    expect(
      social.children?.map((item) => item.slug).slice(-4),
    ).toEqual([
      "desporto",
      "associacao-mulheres-portuarias",
      "velhas-guardas",
      "sindicato",
    ]);
    expect(projects.children?.some((item) => item.slug === "dragagem")).toBe(true);
  });
});
