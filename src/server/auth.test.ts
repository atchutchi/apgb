import { afterEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@supabase/supabase-js";

import { authenticateAdmin, authenticateLocalAdmin, hasRequiredRole, updateAdminProfile } from "./auth";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

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

describe("updateAdminProfile", () => {
  it("actualiza o nome apresentado no modo local sem alterar email ou papel", async () => {
    vi.stubEnv("AUTH_DRIVER", "local");

    await expect(updateAdminProfile(
      { id: "local-admin", email: "admin@apgb.gw", name: "Administrador", role: "admin" },
      { name: "Direccao APGB" },
    )).resolves.toEqual({
      id: "local-admin",
      email: "admin@apgb.gw",
      name: "Direccao APGB",
      role: "admin",
    });
  });
});

describe("authenticateAdmin with Supabase", () => {
  it("usa o perfil administrativo activo quando existe", async () => {
    mockSupabaseProfile({
      profile: { name: "Editora APGB", role: "editor", active: true },
      appMetadata: { role: "admin", name: "Metadata" },
      email: "editor@apgb.gw",
    });
    vi.stubEnv("AUTH_DRIVER", "supabase");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://apgb.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");

    await expect(authenticateAdmin("editor@apgb.gw", "segredo")).resolves.toEqual({
      id: "user-1",
      email: "editor@apgb.gw",
      name: "Editora APGB",
      role: "editor",
    });
  });

  it("recusa perfis administrativos inactivos", async () => {
    mockSupabaseProfile({
      profile: { name: "Admin APGB", role: "admin", active: false },
      appMetadata: { role: "admin", name: "Admin APGB" },
      email: "admin@apgb.gw",
    });
    vi.stubEnv("AUTH_DRIVER", "supabase");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://apgb.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");

    await expect(authenticateAdmin("admin@apgb.gw", "segredo")).resolves.toBeNull();
  });

  it("mantem compatibilidade com app_metadata quando ainda nao existe perfil", async () => {
    mockSupabaseProfile({
      profile: null,
      appMetadata: { role: "admin", name: "Administrador APGB" },
      email: "admin@apgb.gw",
    });
    vi.stubEnv("AUTH_DRIVER", "supabase");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://apgb.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");

    await expect(authenticateAdmin("admin@apgb.gw", "segredo")).resolves.toEqual({
      id: "user-1",
      email: "admin@apgb.gw",
      name: "Administrador APGB",
      role: "admin",
    });
  });
});

function mockSupabaseProfile({
  profile,
  appMetadata,
  email,
}: {
  profile: { name: string; role: "admin" | "editor"; active: boolean } | null;
  appMetadata: Record<string, string>;
  email: string;
}) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: profile, error: null });
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  vi.mocked(createClient).mockReturnValue({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: "user-1",
            email,
            app_metadata: appMetadata,
          },
        },
        error: null,
      }),
    },
    from: vi.fn(() => ({ select })),
  } as never);
}
