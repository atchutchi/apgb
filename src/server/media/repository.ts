import { getProviderConfiguration } from "../providers";
import { LocalMediaRepository } from "./local-repository";
import { MariaDbMediaRepository } from "./mariadb-repository";
import { SupabaseMediaRepository } from "./supabase-repository";
import type { MediaRepository } from "./types";

export function getMediaRepository(): MediaRepository {
  const driver = getProviderConfiguration().content;
  if (driver === "supabase") return new SupabaseMediaRepository();
  if (driver === "mariadb") return new MariaDbMediaRepository();
  return new LocalMediaRepository();
}
