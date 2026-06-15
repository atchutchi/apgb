import { describe, expect, it } from "vitest";

import { authenticateLocalAdmin, hasRequiredRole } from "./auth";

describe("authenticateLocalAdmin", () => {
  const environment = {
    ADMIN_EMAIL: "admin@apgb.gw",
    ADMIN_PASSWORD: "segredo-forte",
  };

  it("devolve a identidade administrativa com credenciais válidas", () => {
    expect(authenticateLocalAdmin("admin@apgb.gw", "segredo-forte", environment)).toEqual({
      id: "local-admin",
      email: "admin@apgb.gw",
      name: "Administrador APGB",
      role: "admin",
    });
  });

  it("recusa email ou palavra-passe inválidos", () => {
    expect(authenticateLocalAdmin("editor@apgb.gw", "segredo-forte", environment)).toBeNull();
    expect(authenticateLocalAdmin("admin@apgb.gw", "errada", environment)).toBeNull();
  });

  it("mantém compatibilidade quando ADMIN_EMAIL ainda não está definido", () => {
    expect(authenticateLocalAdmin("", "segredo-forte", { ADMIN_PASSWORD: "segredo-forte" }))
      .toMatchObject({ role: "admin" });
  });
});

describe("hasRequiredRole", () => {
  const admin = { id: "1", email: "a@apgb.gw", name: "A", role: "admin" as const };
  const editor = { id: "2", email: "e@apgb.gw", name: "E", role: "editor" as const };

  it("permite ao administrador executar acções de administrador e editor", () => {
    expect(hasRequiredRole(admin, "admin")).toBe(true);
    expect(hasRequiredRole(admin, "editor")).toBe(true);
  });

  it("impede o editor de executar acções exclusivas do administrador", () => {
    expect(hasRequiredRole(editor, "editor")).toBe(true);
    expect(hasRequiredRole(editor, "admin")).toBe(false);
  });
});
