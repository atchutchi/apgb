"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  clearAdminSession,
  createAdminSession,
  hasAdminSession,
  verifyAdminPassword,
} from "@/server/auth";
import { getContentRepository } from "@/server/content/repository";
import { getStorageProvider } from "@/server/storage";

const contentSchema = z.object({
  type: z.enum(["page", "news", "project", "document", "gallery", "notice"]),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "published", "archived"]),
  title: z.string().min(3).max(180),
  summary: z.string().min(10).max(500),
  body: z.string().min(10),
  translate: z.boolean(),
});

export async function loginAction(formData: FormData) {
  if (!verifyAdminPassword(String(formData.get("password") || ""))) {
    redirect("/admin?erro=credenciais");
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function createContentAction(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin");
  const input = contentSchema.parse({
    type: formData.get("type"),
    slug: formData.get("slug"),
    status: formData.get("status"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    translate: formData.get("translate") === "on",
  });
  await getContentRepository().create(input);
  revalidatePath("/admin");
  redirect("/admin?estado=conteudo-criado");
}

export async function uploadAction(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin?erro=ficheiro");
  if (file.size > 25 * 1024 * 1024) redirect("/admin?erro=tamanho");
  await getStorageProvider().upload(file);
  revalidatePath("/admin");
  redirect("/admin?estado=ficheiro-carregado");
}
