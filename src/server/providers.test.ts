import { describe, expect, it } from "vitest";

import { getProviderConfiguration } from "./providers";

describe("portable provider configuration", () => {
  it("uses local providers when no infrastructure variables are configured", () => {
    expect(getProviderConfiguration({})).toEqual({
      content: "local",
      storage: "local",
      translation: "disabled",
    });
  });

  it("supports Supabase on Vercel and MariaDB/local storage on cPanel", () => {
    expect(
      getProviderConfiguration({
        CONTENT_DRIVER: "supabase",
        STORAGE_DRIVER: "supabase",
        DEEPL_API_KEY: "configured",
      }),
    ).toEqual({
      content: "supabase",
      storage: "supabase",
      translation: "deepl",
    });

    expect(
      getProviderConfiguration({
        CONTENT_DRIVER: "mariadb",
        STORAGE_DRIVER: "local",
      }),
    ).toEqual({
      content: "mariadb",
      storage: "local",
      translation: "disabled",
    });
  });
});

