import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { primaryNavigation } from "@/config/navigation";

import { pages } from "./pages";

describe("public page catalogue", () => {
  it("provides a page with contextual imagery for every approved menu entry", () => {
    const expected = primaryNavigation.flatMap((section) => [
      section.slug,
      ...(section.children || []).map((item) => item.slug),
    ]);

    for (const slug of expected) {
      const page = pages.find((item) => item.slug === slug);
      expect(page, `Missing page for ${slug || "home"}`).toBeDefined();
      expect(page?.heroImage).toMatch(/^\/media\//);
      expect(
        existsSync(join(process.cwd(), "public", page!.heroImage.replace(/^\//, ""))),
        `Missing hero image for ${slug || "home"}: ${page?.heroImage}`,
      ).toBe(true);
      expect(page?.summary.pt.length).toBeGreaterThan(30);
    }
  });

  it("keeps all public page slugs unique", () => {
    expect(new Set(pages.map((page) => page.slug)).size).toBe(pages.length);
  });

  it("uses parent menu pages as section indexes instead of generic article pages", () => {
    const parentSlugs = primaryNavigation.map((section) => section.slug).filter(Boolean);

    for (const slug of parentSlugs) {
      const page = pages.find((item) => item.slug === slug);
      const navigation = primaryNavigation.find((section) => section.slug === slug);

      expect(page?.blocks, `${slug} should not render generic filler blocks`).toEqual([]);
      expect(page?.menuItems?.map((item) => item.slug)).toEqual(
        navigation?.children?.filter((item) => !item.group).map((item) => item.slug),
      );
    }
  });

  it("uses the approved images for the Director-General and institutional pages", () => {
    expect(pages.find((page) => page.slug === "mensagem-do-director-geral")?.heroImage).toBe(
      "/media/gallery/DG-Felix.webp",
    );
    expect(pages.find((page) => page.slug === "quem-somos")?.heroImage).toBe(
      "/media/gallery/dsc_3989.webp",
    );
    expect(pages.find((page) => page.slug === "comunicacao")?.heroImage).toBe(
      "/media/gallery/apgb1.webp",
    );
    expect(pages.find((page) => page.slug === "comunidade-portuaria")?.heroImage).toBe(
      "/media/gallery/apgb2.webp",
    );
  });

  it("publishes the dredging project and the recent dredging news", () => {
    expect(pages.find((page) => page.slug === "dragagem")?.galleryUrls?.length).toBeGreaterThan(20);
    expect(
      pages.find((page) => page.slug === "inicio-trabalhos-dragagem-porto-bissau")?.publishedAt?.pt,
    ).toBe("21 de Janeiro de 2026");
  });

  it("publishes the Dakar maritime transport forum news", () => {
    const page = pages.find((item) => item.slug === "forum-desenvolvimento-sustentavel-transportes-maritimos-dakar");

    expect(page?.publishedAt?.pt).toBe("14 de Julho de 2026");
    expect(page?.galleryUrls).toHaveLength(4);
    expect(page?.blocks).toHaveLength(5);
  });

  it("defines the institutional leadership order for the Quem Somos page", () => {
    const leadership = pages.find((page) => page.slug === "quem-somos")?.leadership;

    expect(leadership?.map((group) => group.title.pt)).toEqual([
      "Conselho de Administração",
      "Direcção-Geral e Direcções de Serviço",
    ]);
    expect(leadership?.[0].members.map((member) => member.name.pt)).toEqual([
      "Dr. Certório Biote",
      "Dr. Batista Te",
      "Dr. Pansao da Silva",
    ]);
    expect(leadership?.[0].members[0]).toMatchObject({
      image: "/media/gallery/Certorio-Biote.webp",
      alt: { pt: "Dr. Certório Biote, Presidente do Conselho de Administração da APGB" },
    });
    expect(leadership?.[1].members[0]).toMatchObject({
      name: { pt: "Dr. Felix B. Nandungue" },
      role: { pt: "Director-Geral" },
      image: "/media/gallery/DG-Felix.webp",
    });
    expect(leadership?.[1].members.slice(1).map((member) => member.image)).toEqual([
      "/media/gallery/Quintino-da-Silva-Co.webp",
      "/media/gallery/Dr-Mamadu-Lamine-Sane.webp",
      "/media/gallery/Naio-Brandão-Vieira-Té.webp",
      "/media/gallery/Domingos-Brito.webp",
      "/media/gallery/Dr-Martinho-Fiefe.webp",
      "/media/gallery/Virgilio-Carlos-A-Medina.webp",
      "/media/gallery/Dr-Nixon-Sousa.webp",
    ]);
  });

  it("publishes the institutional mission, vision and attributions", () => {
    const page = pages.find((item) => item.slug === "missao-visao-valores");

    expect(page?.blocks.map((block) => block.title.pt)).toContain("Atribuições");
    expect(page?.blocks.map((block) => block.title.pt)).toContain("Valor: Segurança");
    expect(page?.heroImage).toBe("/media/gallery/dsc_3978.webp");
  });

  it("attaches the institutional source documents to the relevant pages", () => {
    expect(pages.find((item) => item.slug === "quem-somos")?.documentUrls).toContain(
      "/documents/apgb-apresentacao-empresa-setembro-2025.docx",
    );
    expect(pages.find((item) => item.slug === "organigrama")?.documentUrls).toContain(
      "/documents/projecto-organica-apgb-2025.docx",
    );
  });

  it("recreates the five service areas from the organic structure", () => {
    const chart = pages.find((item) => item.slug === "organigrama")?.organization;

    expect(chart?.governance.map((node) => node.title.pt)).toContain("Director-Geral");
    expect(chart?.services).toHaveLength(5);
    expect(chart?.services.map((service) => service.title.pt)).toContain(
      "Direcção de Serviços de Operações Portuárias",
    );
  });
});
