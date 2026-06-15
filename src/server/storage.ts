import { mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

import { getProviderConfiguration } from "./providers";

export type UploadedAsset = {
  url: string;
  path: string;
  contentType: string;
  size: number;
  originalName: string;
};

export interface StorageProvider {
  upload(file: File): Promise<UploadedAsset>;
}

class LocalStorageProvider implements StorageProvider {
  async upload(file: File): Promise<UploadedAsset> {
    const extension = extname(file.name).toLowerCase();
    const path = `${new Date().getFullYear()}/${randomUUID()}${extension}`;
    const destination = join(process.cwd(), "public", "uploads", path);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, Buffer.from(await file.arrayBuffer()));
    return { url: `/uploads/${path}`, path, contentType: file.type, size: file.size, originalName: file.name };
  }
}

class SupabaseStorageProvider implements StorageProvider {
  async upload(file: File): Promise<UploadedAsset> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "public-media";
    if (!url || !key) throw new Error("Configuração Supabase incompleta.");
    const client = createClient(url, key, { auth: { persistSession: false } });
    const path = `${new Date().getFullYear()}/${randomUUID()}${extname(file.name).toLowerCase()}`;
    const { error } = await client.storage.from(bucket).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    const { data } = client.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl, path, contentType: file.type, size: file.size, originalName: file.name };
  }
}

export function getStorageProvider(): StorageProvider {
  return getProviderConfiguration().storage === "supabase"
    ? new SupabaseStorageProvider()
    : new LocalStorageProvider();
}
