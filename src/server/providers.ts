export type ContentDriver = "local" | "supabase" | "mariadb";
export type StorageDriver = "local" | "supabase";
export type TranslationDriver = "disabled" | "deepl";

export type ProviderConfiguration = {
  content: ContentDriver;
  storage: StorageDriver;
  translation: TranslationDriver;
};

type Environment = Record<string, string | undefined>;

function contentDriver(value?: string): ContentDriver {
  if (value === "supabase" || value === "mariadb") return value;
  return "local";
}

function storageDriver(value?: string): StorageDriver {
  if (value === "supabase") return value;
  return "local";
}

export function getProviderConfiguration(
  environment: Environment = process.env,
): ProviderConfiguration {
  return {
    content: contentDriver(environment.CONTENT_DRIVER),
    storage: storageDriver(environment.STORAGE_DRIVER),
    translation: environment.DEEPL_API_KEY ? "deepl" : "disabled",
  };
}

