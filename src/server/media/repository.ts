import { getProviderConfiguration } from "../providers";
import { LocalMediaRepository } from "./local-repository";
import { MariaDbMediaRepository } from "./mariadb-repository";
import { SupabaseMediaRepository } from "./supabase-repository";
import type { MediaRepository } from "./types";

export function getMediaRepository(): MediaRepository {
  const { content, storage } = getProviderConfiguration();
  if (storage === "supabase") return new SupabaseMediaRepository();
  if (content === "mariadb") return new MariaDbMediaRepository();
  return new LocalMediaRepository();
}
