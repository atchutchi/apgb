import { afterEach, describe, expect, it, vi } from "vitest";

import { LocalMediaRepository } from "./local-repository";
import { MariaDbMediaRepository } from "./mariadb-repository";
import { getMediaRepository } from "./repository";
import { SupabaseMediaRepository } from "./supabase-repository";

describe("getMediaRepository", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("usa Supabase quando o armazenamento est\u00e1 no Supabase", () => {
    vi.stubEnv("CONTENT_DRIVER", "supabase");
    vi.stubEnv("STORAGE_DRIVER", "supabase");

    expect(getMediaRepository()).toBeInstanceOf(SupabaseMediaRepository);
  });

  it("guarda metadados na MariaDB quando o conte\u00fado usa MariaDB e o ficheiro fica local", () => {
    vi.stubEnv("CONTENT_DRIVER", "mariadb");
    vi.stubEnv("STORAGE_DRIVER", "local");

    expect(getMediaRepository()).toBeInstanceOf(MariaDbMediaRepository);
  });

  it("usa o reposit\u00f3rio local no desenvolvimento sem fornecedores externos", () => {
    vi.stubEnv("CONTENT_DRIVER", "local");
    vi.stubEnv("STORAGE_DRIVER", "local");

    expect(getMediaRepository()).toBeInstanceOf(LocalMediaRepository);
  });
});
