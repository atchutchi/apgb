"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  authenticateAdmin,
  clearAdminSession,
  createAdminSession,
  requireAdminRole,
} from "@/server/auth";
import { getContentRepository } from "@/server/content/repository";
import type { CreateContentInput } from "@/server/content/types";
import { getMediaRepository } from "@/server/media/repository";
import { getStorageProvider } from "@/server/storage";

const contentSchema = z.object({
  type: z.enum(["page", "news", "project", "document", "gallery", "notice"]),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  section: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "published", "archived"]),
  title: z.string().min(3).max(180),
  summary: z.string().min(10).max(500),
  body: z.string().min(10),
  heroImage: z.string().max(1000),
  heroAlt: z.string().max(240),
  featured: z.boolean(),
  galleryUrls: z.array(z.string().max(1000)),
  documentUrls: z.array(z.string().max(1000)),
  translate: z.boolean(),
});

function list(value: FormDataEntryValue | null): string[] {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function contentInput(formData: FormData): CreateContentInput {
  return contentSchema.parse({
    type: formData.get("type"),
    slug: formData.get("slug"),
    section: formData.get("section"),
    status: formData.get("status"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    heroImage: String(formData.get("heroImage") || ""),
    heroAlt: String(formData.get("heroAlt") || ""),
    featured: formData.get("featured") === "on",
    galleryUrls: list(formData.get("galleryUrls")),
    documentUrls: list(formData.get("documentUrls")),
    translate: formData.get("translate") === "on",
  });
}

function refreshPublic(input?: CreateContentInput) {
  revalidatePath("/admin");
  revalidatePath("/pt");
  if (input) revalidatePath(`/pt/${input.section}/${input.slug}`);
}

export async function loginAction(formData: FormData) {
  const identity = await authenticateAdmin(
    String(formData.get("email") || ""),
    String(formData.get("password") || ""),
  );
  if (!identity) redirect("/admin?erro=credenciais");
  await createAdminSession(identity);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function createContentAction(formData: FormData) {
  if (!(await requireAdminRole("editor"))) redirect("/admin");
  const input = contentInput(formData);
  await getContentRepository().create(input);
  refreshPublic(input);
  redirect("/admin?estado=conteudo-criado");
}

export async function updateContentAction(formData: FormData) {
  if (!(await requireAdminRole("editor"))) redirect("/admin");
  const id = String(formData.get("id") || "");
  const input = contentInput(formData);
  await getContentRepository().update(id, input);
  refreshPublic(input);
  redirect("/admin?estado=conteudo-actualizado");
}

export async function archiveContentAction(formData: FormData) {
  if (!(await requireAdminRole("admin"))) redirect("/admin");
  await getContentRepository().archive(String(formData.get("id") || ""));
  refreshPublic();
  redirect("/admin?estado=conteudo-arquivado");
}

export async function removeContentAction(formData: FormData) {
  if (!(await requireAdminRole("admin"))) redirect("/admin");
  await getContentRepository().remove(String(formData.get("id") || ""));
  refreshPublic();
  redirect("/admin?estado=conteudo-removido");
}

export async function uploadAction(formData: FormData) {
  if (!(await requireAdminRole("editor"))) redirect("/admin");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin?erro=ficheiro");
  if (file.size > 25 * 1024 * 1024) redirect("/admin?erro=tamanho");
  const asset = await getStorageProvider().upload(file);
  await getMediaRepository().create({
    title: String(formData.get("title") || asset.originalName),
    altText: String(formData.get("altText") || ""),
    url: asset.url,
    path: asset.path,
    contentType: asset.contentType,
    size: asset.size,
  });
  revalidatePath("/admin");
  redirect("/admin?estado=ficheiro-carregado");
}

export async function updateMediaAction(formData: FormData) {
  if (!(await requireAdminRole("editor"))) redirect("/admin");
  await getMediaRepository().update(String(formData.get("id") || ""), {
    title: String(formData.get("title") || ""),
    altText: String(formData.get("altText") || ""),
  });
  revalidatePath("/admin");
  redirect("/admin?estado=ficheiro-actualizado#ficheiros");
}

export async function removeMediaAction(formData: FormData) {
  if (!(await requireAdminRole("admin"))) redirect("/admin");
  await getMediaRepository().remove(String(formData.get("id") || ""));
  revalidatePath("/admin");
  redirect("/admin?estado=ficheiro-removido#ficheiros");
}
