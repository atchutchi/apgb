import type { ContentRepository } from "./types";
import { LocalContentRepository } from "./local-repository";
import { MariaDbContentRepository } from "./mariadb-repository";
import { SupabaseContentRepository } from "./supabase-repository";
import { getProviderConfiguration } from "../providers";

export function getContentRepository(): ContentRepository {
  const { content } = getProviderConfiguration();
  if (content === "supabase") return new SupabaseContentRepository();
  if (content === "mariadb") return new MariaDbContentRepository();
  return new LocalContentRepository();
}
